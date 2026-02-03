#ifndef S2_TOPOLOGY_H
#define S2_TOPOLOGY_H

#include <string>

// S2 Logic & Helper Functions
const int E_N = 0;
const int E_E = 1;
const int E_S = 2;
const int E_W = 3;

struct S2Trans {
    int next_face;
    int next_edge; // 0=N, 1=E, 2=S, 3=W (of the neighbor)
    bool swap_xy;  // Not strictly needed if we just rotate buffer, but useful for reference
    bool flip_axis; // If we need to flip the strip reading
    int rotation;   // Degrees CCW to align neighbor strip to current face's frame (0, 90, 180, 270)
};

extern S2Trans s2_transitions[6][4];
extern int corner_topology[6][4][4];

void LoadTopology(const std::string& filename);

#endif
