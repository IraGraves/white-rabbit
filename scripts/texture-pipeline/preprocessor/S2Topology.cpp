#include "S2Topology.h"
#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <algorithm>

S2Trans s2_transitions[6][4] = {
    // Face 0 (+X)
    {
        { 2, 3, false, false, 270 }, // N -> 2 W (Rot 270)
        { 1, 3, false, false, 0   }, // E -> 1 W
        { 5, 0, false, false, 0   }, // S -> 5 N
        { 4, 0, false, false, 90  }, // W -> 4 N (CORRECTION: F0-W touches F4-N. Rot 90 for L>T).
    },
    // Face 1 (+Y)
    {
        { 2, 2, false, false, 0   }, // N -> 2 S
        { 3, 3, false, false, 0   }, // E -> 3 W
        { 5, 1, false, false, 270 }, // S -> 5 E
        { 0, 1, false, false, 0   }, // W -> 0 E
    },
    // Face 2 (+Z, North Pole)
    {
        { 4, 0, true,  true,  0   }, // N -> 4 N (Target: FlipV) -> Rot 0 + FlipV
        { 3, 0, false, true,  270 }, // E -> 3 N (Target: Transpose) -> Rot 270 + FlipV
        { 1, 0, false, false, 0   }, // S -> 1 N
        { 0, 0, false, false, 90  }, // W -> 0 N
    },
    // Face 3 (-X)
    {
        { 2, 1, true,  true,  270 }, // N -> 2 E (Target: Transpose) -> Rot 270 + FlipV
        { 4, 3, false, false, 0   }, // E -> 4 W
        { 5, 2, true,  true,  0   }, // S -> 5 S (Target: FlipV) -> Rot 0 + FlipV
        { 1, 1, false, false, 0   }, // W -> 1 E
    },
    // Face 4 (-Y)
    {
        { 2, 0, true,  false, 180 }, // N -> 2 N (Symmetry with F2->N? No, F4->N connects to F2->N). 
        { 0, 3, false, false, 0   }, // E -> 0 W
        { 5, 3, true,  true,  270 }, // S -> 5 W (Target: Transpose) -> Rot 270 + FlipV
        { 3, 1, false, false, 0   }, // W -> 3 E
    },
    // Face 5 (-Z, South Pole)
    {
        { 0, 2, false, false, 0   }, // N -> 0 S
        { 1, 2, false, false, 90  }, // E -> 1 S
        { 3, 2, true,  true,  0   }, // S -> 3 S (Target: FlipV) -> Rot 0 + FlipV
        { 4, 2, true,  true,  270 }, // W -> 4 S (Target: Transpose) -> Rot 270 + FlipV
    },
};

int corner_topology[6][4][4] = {
    // Face 0
    { 
        {2, 3, 4, 1}, // TL (0): N=F2(BL=3), W=F4(TR=1) -> Wait, 3 is BL? 0=TL,1=TR,2=BR,3=BL. Yes.
        {2, 2, 1, 0}, // TR (1): N=F2(BR=2), E=F1(TL=0)
        {5, 1, 4, 2}, // BL (3): S=F5(TR=1, rot?), W=F4(BR=2)
        {5, 0, 1, 3}  // BR (2): S=F5(TL=0), E=F1(BL=3) 
    },
    // Face 1
    {
        {2, 2, 0, 1}, // TL: N=F2(BR), W=F0(TR)
        {2, 1, 3, 0}, // TR: N=F2(TR? No F2->F3 edge E), E=F3(TL)
        {5, 0, 0, 2}, // BL: S=F5(TL), W=F0(BR)
        {5, 3, 3, 3}  // BR: S=F5(BL? No F5->F3 edge E?), E=F3(BL) -> F5 touches F3 at F5-E / F3-S. Vertex F1-BR = F5-TR?
    }, 
    // Face 2 (Top)
    {
        {4, 1, 4, 0}, 
        {0, 0, 0, 0}, 
        {0, 0, 0, 0}, 
        {0, 0, 0, 0}
    },
    // Face 3
    { 
        {0,0,0,0}, {0,0,0,0}, {0,0,0,0}, {0,0,0,0} 
    },
    // Face 4
    { 
        {0,0,0,0}, {0,0,0,0}, {0,0,0,0}, {0,0,0,0} 
    },
    // Face 5
    { 
        {0,0,0,0}, {0,0,0,0}, {0,0,0,0}, {0,0,0,0} 
    }
};

void LoadTopology(const std::string& filename) {
    std::ifstream f(filename);
    if (!f.is_open()) {
        std::cout << "[WARN] " << filename << " not found. Using internal hardcoded table." << std::endl;
        return;
    }
    std::cout << "[INFO] Loading topology from " << filename << "..." << std::endl;
    
    std::stringstream buffer;
    buffer << f.rdbuf();
    std::string text = buffer.str();
    
    size_t cursor = 0;
    
    for(int face=0; face<6; ++face) {
        for(int edge=0; edge<4; ++edge) {
            int n_f = -1;
            int n_e = -1;
            bool flp = false;
            int rt = 0;
            
            for(int field=0; field<4; ++field) {
                size_t key_start = text.find("\"", cursor);
                if (key_start == std::string::npos) break;
                size_t key_end = text.find("\"", key_start + 1);
                std::string key = text.substr(key_start+1, key_end - key_start - 1);
                
                cursor = text.find(":", key_end);
                cursor++; 
                
                while(cursor < text.size() && isspace(text[cursor])) cursor++;
                
                if (text.substr(cursor, 4) == "true") {
                    if (key == "flip") flp = true;
                    cursor += 4;
                } else if (text.substr(cursor, 5) == "false") {
                    if (key == "flip") flp = false;
                    cursor += 5;
                } else {
                    size_t num_end = cursor;
                    while(num_end < text.size() && (isdigit(text[num_end]) || text[num_end] == '-')) num_end++;
                    int val = std::stoi(text.substr(cursor, num_end - cursor));
                    if (key == "next_face") n_f = val;
                    if (key == "next_edge") n_e = val;
                    if (key == "rot") rt = val;
                    cursor = num_end;
                }
            }
            s2_transitions[face][edge].next_face = n_f;
            s2_transitions[face][edge].next_edge = n_e;
            s2_transitions[face][edge].flip_axis = flp;
            s2_transitions[face][edge].rotation = rt;
        }
    }
    std::cout << "[SUCCESS] Topology Loaded." << std::endl;
}
