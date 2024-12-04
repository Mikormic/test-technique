const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js')
    .postCss('resources/css/app.css', 'public/css', [
        require('tailwindcss'),
    ]).webpackConfig({
        module: {
            rules: [
                {
                    test: /\.(postcss)$/,
                    use: [
                        'vue-style-loader',
                        { loader: 'css-loader', options: { importLoaders: 1 } },
                        'postcss-loader'
                    ]
                }
            ],
        },
    })
    .alias({
        '@': 'resources/js',
        ziggy: "vendor/tightenco/ziggy/dist/vue",
    }).vue({ version: 3 });

    // BrowserSync configuration
mix.browserSync({
    proxy: 'http://localhost', // URL de ton application (APP_URL dans ton `.env`)
    files: [
        'resources/views/**/*.blade.php', // Fichiers Blade
        'resources/js/**/*.js',          // Fichiers JS
        'resources/css/**/*.css',        // Fichiers CSS
        'public/js/**/*.js',             // Fichiers JS compilés
        'public/css/**/*.css',           // Fichiers CSS compilés
    ],
    open: false, // Empêche d'ouvrir automatiquement le navigateur
    notify: false, // Désactive les notifications dans le navigateur
});

if (mix.inProduction()) {
    mix.version();
}
