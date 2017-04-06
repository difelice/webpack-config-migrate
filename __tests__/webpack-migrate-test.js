import webpackMigrate from "../index";
import webpack from "webpack";

describe("webpack migrate", () => {
  it("matches v1 to v2 snapshot", () => {
    expect(webpackMigrate([V1_CONFIG])).toMatchSnapshot();
  });
});

const V1_CONFIG = {
  context: `${__dirname}/src`,
  entry: {
    admin_app: "./admin/app.js"
  },
  output: {
    path: "../static/dist",
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: [/node_modules/, /vendor/],
        loader: "babel"
      },
      { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.json$/, loader: "json-loader" }
    ]
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin()
  ],
  externals: {
    jquery: "jQuery"
  },
  resolveLoader: {
    root: "./node_modules"
  },
  resolve: {
    root: ["./app_modules"]
  }
};
