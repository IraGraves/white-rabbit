import re

def test_regex(filename):
    # Current regex in code
    strip_pattern = r'([._]?face_?\d+(\.tif)?|\.vrt)$'
    prefix = re.sub(strip_pattern, '', filename, flags=re.IGNORECASE)
    print(f"'{filename}' -> '{prefix}'")
    return prefix

print("--- Current Behavior ---")
test_regex("my_image_face0.vrt")
test_regex("my_image.vrt")
test_regex("image_face1.tif")
test_regex("complex.name_face3.vrt")

print("\n--- Desired Behavior Check (New Regex) ---")
# Proposed regex: strip optional face suffix AND optional extension
# We want: 
#   name_face0.vrt -> name
#   name.vrt -> name
#   name_face0.tif -> name

def test_new_regex(filename):
    # Improved regex
    # 1. Match optional _faceN
    # 2. Match extension (.tif or .vrt)
    # The original regex was: r'([._]?face_?\d+(\.tif)?|\.vrt)$'
    # This means: EITHER (face+optional_tif) OR (.vrt)
    # So "face0.vrt" matches neither completely in a way that leaves just "name"?
    # Actually:
    # "my_image_face0.vrt"
    #   - "face0.vrt" does not match (face...tif)?
    #   - ".vrt" matches the end.
    #   So it replaces ".vrt" with empty -> "my_image_face0" -> FAIL
    
    # New logic:
    # We want to strip:
    #   (optional [._]face\d+) + ( .vrt OR .tif )
    
    pattern = r'([._]?face_?\d+)?(\.vrt|\.tif)$'
    prefix = re.sub(pattern, '', filename, flags=re.IGNORECASE)
    print(f"'{filename}' -> '{prefix}'")

test_new_regex("my_image_face0.vrt")
test_new_regex("my_image.vrt")
test_new_regex("image_face1.tif")
test_new_regex("complex.name_face3.vrt")
