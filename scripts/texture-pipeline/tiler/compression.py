"""
Compression module for Planet Tiler.
Handles Draco and KTX2 compression of GLB files using gltf-transform.
"""

import os
import shutil
import subprocess


def compress_tile(path, draco_level=7, ktx2_quality=128, ktx2_compression=1, draco_quant_pos=14):
    """
    Compresses a GLB file with Draco and KTX2 using gltf-transform.
    Tries different paths/commands to find the tool.
    
    Returns: (success: bool, error_message: str)
    """
    
    # Potential commands / paths
    candidates = [
        ["gltf-transform"],
        ["gltf-transform.cmd"], # Windows
        [os.path.expanduser("~") + r"\AppData\Roaming\npm\gltf-transform.cmd"], # Typical global install
        ["npx", "gltf-transform"] # Fallback (slow but reliable)
    ]
    
    final_cmd_prefix = None
    
    for c in candidates:
        prog = c[0]
        # Check integrity
        if shutil.which(prog) or os.path.exists(prog):
            final_cmd_prefix = c
            break
            
    # If npx, always try it, even if which npx fails (Shell path handling magic)
    if not final_cmd_prefix:
        final_cmd_prefix = ["npx", "gltf-transform"]

    # Prepare Environment (fix Node Path)
    env = os.environ.copy()
    node_paths = [
        r"C:\Program Files\nodejs",
        r"C:\Program Files (x86)\nodejs",
        os.path.expanduser("~") + r"\AppData\Roaming\npm"
    ]
    
    # Fix KTX-Software Path (manually inject if missing)
    ktx_paths = [
        r"C:\Program Files\KTX-Software\bin",
        r"C:\Program Files (x86)\KTX-Software\bin"
    ]
    
    # Extend path so 'node' is found
    current_path = env.get("PATH", "")
    
    # Add Node Paths
    for np_path in node_paths:
        if os.path.exists(np_path) and np_path not in current_path:
            current_path = np_path + os.pathsep + current_path
            
    # Add KTX Paths
    for kp_path in ktx_paths:
        if os.path.exists(kp_path) and kp_path not in current_path:
            current_path = kp_path + os.pathsep + current_path
            
    env["PATH"] = current_path

    try:
        # STRATEGY: 
        # To avoid all path/glob/quoting issues on Windows, we:
        # 1. Switch CWD to the file's directory.
        # 2. Use simple filenames (no paths).
        # 3. Use a temp output file to avoid in-place locking issues.
        
        abs_path = os.path.abspath(path)
        work_dir = os.path.dirname(abs_path)
        filename = os.path.basename(abs_path)
        temp_filename = f"opt_{filename}"
        
        # Nuclear Option: Direct Node.js invocation of the JS file.
        # Bypasses .cmd wrappers, npx, and shell parsing quirks.
        
        npm_root = os.path.join(os.environ.get("APPDATA", ""), "npm")
        cli_js = os.path.join(npm_root, "node_modules", "@gltf-transform", "cli", "bin", "cli.js")
        
        if os.path.exists(cli_js):
            # Resolve full path to node.exe to avoid WinError 2
            node_executable = "node"
            for np_path in node_paths:
                test_exe = os.path.join(np_path, "node.exe")
                if os.path.exists(test_exe):
                    node_executable = test_exe
                    break
            
            # Run node directly
            base_cmd = [node_executable, cli_js]
        else:
            # Fallback (unlikely to work if previous attempts failed, but necessary)
            base_cmd = ["npx", "@gltf-transform/cli"]
            
        # 1. ETC1S: original -> temp
        file_only = os.path.basename(abs_path)
        filename = f"{file_only}"
        temp_filename = f"opt_{file_only}"
        
        # Build ETC1S command with quality parameters
        cmd1 = base_cmd + [
            "etc1s", filename, temp_filename,
            "--quality", str(ktx2_quality),
            "--compression", str(ktx2_compression)
        ]
        
        # 2. Draco: temp -> original (overwrite)
        # Build Draco command with speed and quantization
        cmd2 = base_cmd + [
            "draco", temp_filename, filename,
            "--encode-speed", str(10 - draco_level), # 0=Best speed, 10=Best compression
            "--decode-speed", str(10 - draco_level),
            "--quantize-position", str(draco_quant_pos)
        ]
        
        commands_list = [cmd1, cmd2]
        
        for cmd_list in commands_list:
            # Result capture
            result = subprocess.run(cmd_list, capture_output=True, text=True, shell=False, env=env, cwd=work_dir)
            
            if result.returncode != 0:
                # Cleanup temp
                if os.path.exists(os.path.join(work_dir, temp_filename)):
                    os.remove(os.path.join(work_dir, temp_filename))
                    
                err = result.stderr.strip()
                if not err: err = f"Exit Code {result.returncode} (Unknown Error)"
                
                # Intelligent Error Diagnosis
                if "ktx" in err.lower() and "not found" in err.lower():
                    err = "\n>>> CRITICAL MISSING DEPENDENCY: 'KTX-Software' is required for etc1s compression.\n" \
                          ">>> Please download and install from: https://github.com/KhronosGroup/KTX-Software/releases"
                
                # Debug Info
                check_path = os.path.join(work_dir, file_only)
                exists = "EXISTS" if os.path.exists(check_path) else "MISSING"
                
                return False, f"Command failed: {cmd_list}\nIn Dir: {work_dir}\nFile Status: {exists}\nError: {err}"
        
        # Cleanup temp file
        if os.path.exists(os.path.join(work_dir, temp_filename)):
             os.remove(os.path.join(work_dir, temp_filename))
             
        return True, ""
    except Exception as e:
        return False, str(e)
