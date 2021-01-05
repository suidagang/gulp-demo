var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    rev = require('gulp-rev'), //- 对文件名加MD5后缀
    revCollector = require('gulp-rev-collector'), //- 路径替换
    clean = require('gulp-clean'); //- 清空文件夹，避免资源冗余

gulp.task('css-md5', function () { //- 创建一个名为 concat 的 task
    return gulp.src(['./lib/css/*.css']) //- 需要处理的css文件，放到一个字符串数组里
        .pipe(rev()) //- 文件名加MD5后缀
        .pipe(gulp.dest('./dist/lib/css')) //- 输出文件本地
        .pipe(rev.manifest()) //- 生成一个rev-manifest.json
        .pipe(gulp.dest('./rev/css')) //- 将 rev-manifest.json 保存到 rev 目录内
        .on('end', function () {
            console.log('css-md5 has been completed');
        });
});

gulp.task('js-md5', function () { //- 创建一个名为 concat 的 task
    return gulp.src(['./lib/js/*.js']) //- 需要处理的js文件，放到一个字符串数组里
        .pipe(rev()) //- 文件名加MD5后缀
        .pipe(gulp.dest('./dist/lib/js')) //- 输出文件本地
        .pipe(rev.manifest()) //- 生成一个rev-manifest.json
        .pipe(gulp.dest('./rev/js')) //- 将 rev-manifest.json 保存到 rev 目录内
        .on('end', function () {
            console.log('js-md5 has been completed');
        });
});

gulp.task('rev', function () {
    return gulp.src(['./rev/**/*.json', './*.html']) //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件。通过hash来精确定位到html模板中需要更改的部分，然后将修改成功的文件生成到指定目录
        .pipe(revCollector({
            replaceReved: true, //允许替换, 已经被替换过的文件
        })) //- 执行文件内css名的替换
        .pipe(gulp.dest('./dist/')) //- 替换后的文件输出的目录
        .on('end', function () {
            console.log('rev has been completed');
        });
});
// 拷贝plugin
gulp.task('copyPlugin', function () {
    return gulp.src('lib/plugin/**/*')
        .pipe(gulp.dest('dist/lib/plugin'))
        .on('end', function () {
            console.log('copyPlugin has been completed');
        });
});

gulp.task('clean', function () {
    return gulp.src(['./dist', './rev'])
        .pipe(clean())
        .on('end', function () {
            console.log('clean has been completed');
        });
});
//开发构建
gulp.task('build', function () {
    runSequence('clean', ['css-md5', 'js-md5', 'copyPlugin'], 'rev');
});