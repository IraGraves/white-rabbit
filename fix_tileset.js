const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'public/assets/textures/LOD/moon/tileset.json');

const content = {
  asset: {
    version: '1.0',
    extras: {
      ion: {
        georeferenced: true,
        movable: true,
      },
    },
  },
  geometricError: 3.457875123876017,
  root: {
    geometricError: 3.457875123876017,
    refine: 'ADD',
    boundingVolume: {
      box: [
        -0.001318126916885376, -0.0014895796775817871, -0.00021636486053466797, 0.9977428019046783,
        0, 0, 0, 0.9966537952423096, 0, 0, 0, 1.000207781791687,
      ],
    },
    children: [
      {
        boundingVolume: {
          box: [
            -0.001318126916885376, -0.0014895796775817871, -0.00021636486053466797,
            0.9977428019046783, 0, 0, 0, 0.9966537952423096, 0, 0, 0, 1.000207781791687,
          ],
        },
        geometricError: 3.457875123876017,
        children: [
          {
            boundingVolume: {
              box: [
                -0.001318126916885376, -0.0014895796775817871, -0.00021636486053466797,
                0.9977428019046783, 0, 0, 0, 0.9966537952423096, 0, 0, 0, 1.000207781791687,
              ],
            },
            content: {
              uri: '0material0_0.b3dm',
            },
            geometricError: 0.0035194786371772397,
            refine: 'REPLACE',
            children: [
              {
                boundingVolume: {
                  box: [
                    -0.001318126916885376, -0.0014895796775817871, -0.00021636486053466797,
                    0.9977428019046783, 0, 0, 0, 0.9966537952423096, 0, 0, 0, 1.000207781791687,
                  ],
                },
                content: {
                  uri: '0material0_0_original_texture.b3dm',
                },
                geometricError: 0,
              },
            ],
          },
          {
            boundingVolume: {
              box: [
                -0.0028294538596616015, -0.00109108850315133, -1.0001902878284454,
                0.002829445108587958, 0, 0, 0, 0.0010910887648173245, 0, 0, 0,
                0.0001996457576751709,
              ],
            },
            geometricError: 0.006078188132587082,
            children: [
              {
                boundingVolume: {
                  box: [
                    -0.0028294538596616015, -0.00109108850315133, -1.0001902878284454,
                    0.002829445108587958, 0, 0, 0, 0.0010910887648173245, 0, 0, 0,
                    0.0001996457576751709,
                  ],
                },
                content: {
                  uri: '0material0_00.b3dm',
                },
                geometricError: 0,
              },
            ],
          },
          {
            boundingVolume: {
              box: [
                -0.005450412237939961, -0.004159350484530727, 0.9993450045585632,
                0.005450418612065189, 0, 0, 0, 0.004159350343127449, 0, 0, 0, 0.0006464123725891113,
              ],
            },
            geometricError: 0.013773177887337016,
            children: [
              {
                boundingVolume: {
                  box: [
                    -0.005450412237939961, -0.004159350484530727, 0.9993450045585632,
                    0.005450418612065189, 0, 0, 0, 0.004159350343127449, 0, 0, 0,
                    0.0006464123725891113,
                  ],
                },
                content: {
                  uri: '0material0_03.b3dm',
                },
                geometricError: 0.006566422334292512,
                refine: 'REPLACE',
                children: [
                  {
                    boundingVolume: {
                      box: [
                        -0.005450412237939961, -0.004159350484530727, 0.9993450045585632,
                        0.005450418612065189, 0, 0, 0, 0.004159350343127449, 0, 0, 0,
                        0.0006464123725891113,
                      ],
                    },
                    content: {
                      uri: '0material0_03_original_texture.b3dm',
                    },
                    geometricError: 0,
                  },
                ],
              },
            ],
          },
          {
            boundingVolume: {
              box: [
                0.0043728774619125055, 0.0072622279860868055, 0.9990687668323517,
                0.004372871087787278, 0, 0, 0, 0.0072622281274900835, 0, 0, 0,
                0.0009226500988006592,
              ],
            },
            geometricError: 0.017054411995836256,
            children: [
              {
                boundingVolume: {
                  box: [
                    0.0043728774619125055, 0.0072622279860868055, 0.9990687668323517,
                    0.004372871087787278, 0, 0, 0, 0.0072622281274900835, 0, 0, 0,
                    0.0009226500988006592,
                  ],
                },
                content: {
                  uri: '0material0_06.b3dm',
                },
                geometricError: 0.0028384896114185677,
                refine: 'REPLACE',
                children: [
                  {
                    boundingVolume: {
                      box: [
                        0.0043728774619125055, 0.0072622279860868055, 0.9990687668323517,
                        0.004372871087787278, 0, 0, 0, 0.0072622281274900835, 0, 0, 0,
                        0.0009226500988006592,
                      ],
                    },
                    content: {
                      uri: '0material0_06_original_texture.b3dm',
                    },
                    geometricError: 0,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

console.log('Writing clean tileset.json...');
fs.writeFileSync(targetPath, JSON.stringify(content, null, 2), { encoding: 'utf8' });
console.log('Done. Size:', fs.statSync(targetPath).size);
