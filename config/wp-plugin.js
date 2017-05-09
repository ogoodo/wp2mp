
function MyPlugin(options) {
  // Configure your plugin with options...
}

MyPlugin.prototype.apply = function(compiler) {
  // console.log('wp-plugin.js->compiler:', compiler);
  compiler.plugin("compile", function(params) {
    // console.log("开始编译The compiler is starting to compile...");
    console.log("==================compile================");
  });

  compiler.plugin("make", (compilation, callback) => {
    console.log("==================make================");
    // outFiles(compilation);
    callback();
  });


  // compiler.plugin("after-compile", function(params) {
  //   console.log("编译完成");
  // });

  compiler.plugin("compilation", function(compilation) {
    console.log("The compiler is starting a new compilation...");
    // outFiles(compilation); // 此处文件还没有读进来

    compilation.plugin('normal-module-loader', function(loaderContext, module) {
      console.log("==================normal-module-loader================");
      // outFiles(compilation);
      // this is where all the modules are normal-module-loaderloaded
      // one by one, no dependencies are created yet
    });

    compilation.plugin('seal', function() {
      console.log("==================seal================");
      //you are not accepting any more modules
      //no arguments
    });

    compilation.plugin("optimize", function() {
      console.log("The compilation is starting to optimize files...");
    });

    compilation.plugin('optimize-tree', function(chunks, modules) {
      console.log("==================optimize-tree================");

    });

    compilation.plugin('optimize-modules', function(modules) {
      console.log("==================optimize-modules================");
        //handle to the modules array during tree optimization
    });

    compilation.plugin('optimize-chunks', function(chunks) {
      console.log("==================optimize-chunks================");
        //unless you specified multiple entries in your config
        //there's only one chunk at this point
        chunks.forEach(function (chunk) {
            //chunks have circular references to their modules
            chunk.modules.forEach(function (module){
                //module.loaders, module.rawRequest, module.dependencies, etc.
            }); 
        });
    });

  });

  // compiler.plugin("emit", function(compilation, callback) {
  //   console.log("The compilation is going to emit files...");
  //   callback();
  // });

  /**
   * 测试可用
   * 一个简单的插件，生成一个filelist-test.md文件，里面的内容是，列出我们build的所有asset 文件。
   */
  compiler.plugin('emit', function(compilation, callback) {
    console.log("emit即将准备生成文件==================================");
    // Create a header string for the generated file:
    // outFiles(compilation);
    callback();
  });

  compiler.plugin('after-emit', function(compilation, callback) {
    console.log('生成文件之后');
    callback();
  });
};

module.exports = MyPlugin;

function outFiles(compilation) {
   var filelist = 'In this build file list2:\n\n';

  // Loop through all compiled assets,
  // adding a new line item for each filename.
  for (var filename in compilation.assets) {
    filelist += ('- '+ filename +'\n');
    var item = compilation.assets[filename];
    filelist += item.source();
    filelist += '\r\n\r\n';
  }
  
  // Insert this list into the Webpack build as a new file asset:
  compilation.assets['filelist-test.md'] = {
    source: function() {
      return filelist;
    },
    size: function() {
      return filelist.length;
    }
  };
}
