#ifndef S2_ANALYSIS_H
#define S2_ANALYSIS_H

#include <string>
#include <vector>

// Analyzes the input files and prints a detailed report
void AnalyzeInput(const std::string& inputPath, 
                  const std::string& northPath, 
                  const std::string& southPath,
                  int maxZoom, int maxZoomPole, int tileSize);

#endif
