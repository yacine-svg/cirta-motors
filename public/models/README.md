# 3D models

Drop one `.glb` file per car here, named after the car's `slug` in `data/cars.ts`:

    public/models/volkswagen-golf-8.glb
    public/models/mercedes-classe-c.glb
    ...

Until a file exists, the car page falls back to the photo gallery automatically.

To let the colour swatches repaint the car, the body material inside the GLB
should have a name containing "paint", "body" or "exterior" (for example `CarPaint`).
