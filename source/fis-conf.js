/**
 * Created by jack on 17/2/5.
 */

fis.set('path','/app');

const vueify = require('fis3-parser-vueify');

fis.hook('relative');
fis.match('**', {
    relative: true
})

fis.hook('commonjs', {
    baseUrl: './src',
    extList: ['.js', '.jsx', '.es', '.ts', '.vue']
});

fis.match('/{node_modules,src}/**.js',{
    isMod:true,
    useSameNameRequire:true
});

fis.match('/src/**.{js,vue:js,jsx}',{
    rExt:'.js',
    isMod:true,
    useSameNameRequire:true,
    parser:fis.plugin('babel-5.x',{

    })
});

// 添加css和image加载支持
fis.match('*.{js,jsx,ts,tsx,vue}', {
    preprocessor: [
        fis.plugin('js-require-css'),
        fis.plugin('js-require-file', {
            useEmbedWhenSizeLessThan: 10 * 1024 // 小于10k用base64
        })
    ]
});

fis.match('/static/**.js', {
    parser: null,
    isMod: false
});

// 用 loader 来自动引入资源。
fis.match('::package', {
    postpackager: fis.plugin('loader')
});

fis.match('/{src,node_modules}/**',{
    release:fis.get('path')+'/static/$0'
}).match('/static/**',{
    release:fis.get('path')+'$0'
}).match('/src/(*.html)',{
    release:fis.get('path')+'/$1'
});

fis.match('{/static/css/*.less,/src/**.css}', {
    parser: 'less2',
    rExt: '.css',
    postprocessor : fis.plugin("autoprefixer",{
        "browsers": ['Firefox >= 20', 'Safari >= 6', 'Explorer >= 9', 'Chrome >= 12', "ChromeAndroid >= 4.0"],
        "flexboxfixer": true,
        "gradientfixer": true
    }),
    optimizer: fis.plugin('clean-css')
}).match('/{static,src,node_modules}/**.{css,less}',{
    packTo:'/static/pkg/all.css'
});

fis.match('/src/(**.vue)', {
    rExt: 'js',
    isMod:true,
    useSameNameRequire:true,
    parser:fis.plugin(vueify,{})
});


// 禁用components
fis.unhook('components');
fis.hook('node_modules');

fis.media('prod')
    .match('/static/js/**.js',{packTo:'/static/pkg/common.js'})
    .match('/{node_modules,src}/**.{js,vue}',{
        packTo:'/static/pkg/bundle.js'
    })
    .match('::package',{
        postpackager: [  fis.plugin('loader')]
        // postpackager: [fis.plugin('compression'),  fis.plugin('loader')]
    })
    .match('**', {
    deploy: [
        fis.plugin('skip-packed', {
        }),
        fis.plugin('local-deliver', {
            to: '../../../HBuilderProjects/'
        })
    ]
});

