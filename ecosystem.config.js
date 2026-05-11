module.exports = {
  apps: [
    {
      name: "investigoo",
      script: "dist/index.js",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        PORT: "5000",

        DATABASE_URL: "postgresql://Invg1line:npg_FeOU4uk2opSE1@localhost:5432/PostGresProd",

        SESSION_SECRET: "cdaf571f2066cb0e9f79b84b3672f5b7ccd5f0ac64a185f4ef54ec028279e8de4e1b869b1c4d2a8929990322f0189111",

        DEFAULT_OBJECT_STORAGE_BUCKET_ID: "",
        PRIVATE_OBJECT_DIR: ".private",
        PUBLIC_OBJECT_SEARCH_PATHS: "public",
      },
    },
  ],
};
