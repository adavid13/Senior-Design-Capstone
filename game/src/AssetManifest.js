const assetManifest = {
  images: [
    {
      name: 'logo',
      path: './assets/images/logo.png',
      loadOnStart: true,
    },
    {
      name: 'btnBluePressed',
      path: './assets/ui/buttonLong_blue_pressed.png',
      loadOnStart: true,
    },
    {
      name: 'btnBlue',
      path: './assets/ui/buttonLong_blue.png',
      loadOnStart: true,
    },
  ],
  spritesheets: [
    {
      name: 'grassland0',
      path: './assets/spritesheets/tiles_grassland_dense_clear_green.png',
      frameWidth: 210,
      frameHeight: 210,
      loadOnStart: true,
    },
    {
      name: 'grassland1',
      path: './assets/spritesheets/tiles_grassland_dense_covered_green.png',
      frameWidth: 210,
      frameHeight: 210,
      loadOnStart: true,
    },
    {
      name: 'grassland2',
      path: './assets/spritesheets/tiles_grassland_sparse_clear_green.png',
      frameWidth: 210,
      frameHeight: 210,
      loadOnStart: true,
    },
    {
      name: 'grassland3',
      path: './assets/spritesheets/tiles_grassland_sparse_covered_green.png',
      frameWidth: 210,
      frameHeight: 210,
      loadOnStart: true,
    },
  ],
};

export default assetManifest;
