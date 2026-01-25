"""
Compression module for Planet Tiler.
Handles Draco and KTX2 compression of GLB files using gltf-transform.
"""

import os
import shutil
import subprocess


def compress_tile(path, draco_level=7, ktx2_quality=128, ktx2_compression=1, draco_quant_pos=12, ktx2_mode="etc1s", ktx2_uastc_quality=2, ktx2_zstd=0):
    """
    Calls out to the Node.js gltf-transform optimization script.
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
            
        # 1. Single-Process Optimization (JS Script)
        file_only = os.path.basename(abs_path)
        filename = f"{file_only}"
        temp_filename = f"opt_{file_only}"
        
        # Path to our custom optimization script
        script_dir = os.path.dirname(os.path.abspath(__file__))
        opt_script = os.path.join(script_dir, "optimize_glb.mjs")
        
        if not os.path.exists(opt_script):
             # Fallback check for .js if .mjs missing (legacy)
             opt_script_js = os.path.join(script_dir, "optimize_glb.js")
             if os.path.exists(opt_script_js):
                 opt_script = opt_script_js
             else:
                 return False, f"Optimization script not found: {opt_script}"

        # Resolve Node.js executable
        npm_root = os.path.join(os.environ.get("APPDATA", ""), "npm")
        node_executable = "node"
        
        # Try to find a specific node exe if "node" isn't sufficient
        for np_path in node_paths:
            test_exe = os.path.join(np_path, "node.exe")
            if os.path.exists(test_exe):
                node_executable = test_exe
                break

        # Build Command: node optimize_glb.js input output ktx_q ktx_eff draco_spd quant
        cmd = [
            node_executable,
            opt_script,
            filename, temp_filename,
            str(ktx2_quality),
            str(ktx2_compression),
            str(10 - draco_level) if draco_level is not None and draco_level >= 0 else "-1",
            str(draco_quant_pos),
            ktx2_mode,
            str(ktx2_uastc_quality),
            str(ktx2_zstd)
        ]
        
        # Run script
        result = subprocess.run(cmd, capture_output=True, text=True, shell=False, env=env, cwd=work_dir)
        
        if result.returncode != 0:
            # Cleanup temp
            if os.path.exists(os.path.join(work_dir, temp_filename)):
                os.remove(os.path.join(work_dir, temp_filename))
                
            err = result.stderr.strip()
            if not err: err = f"Exit Code {result.returncode} (Unknown Error)"
            
            # Intelligent Error Diagnosis
            if "MODULE_NOT_FOUND" in err:
                 return False, f"Missing Node.js dependencies. Please run 'npm install @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions draco3dgltf' in the script directory.\nError: {err}"
            
            return False, f"Command failed: {cmd}\nIn Dir: {work_dir}\nError: {err}"
        
        # Success: Replace original with optimized
        try:
             shutil.move(os.path.join(work_dir, temp_filename), abs_path)
        except Exception as e:
             return False, f"Failed to allow move temp file: {e}"
        

        
        # Cleanup temp file
        if os.path.exists(os.path.join(work_dir, temp_filename)):
             os.remove(os.path.join(work_dir, temp_filename))
             
        # Extract Summary from stdout
        summary = ""
        if result.stdout:
            for line in result.stdout.splitlines():
                if "[OPT_SUMMARY]" in line:
                    summary = line.strip().replace("[OPT_SUMMARY] ", "")
                    break
             
        return True, summary
    except Exception as e:
        return False, str(e)
