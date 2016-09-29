namespace :webpack do
  desc 'compile bundles using webpack'
  task :compile do
    cmd = 'webpack --config webpack.prod.config.js --json'
    output = `#{cmd}`

    stats = JSON.parse(output)

    File.open('./public/assets/webpack-asset-manifest.json', 'w') do |f|
      f.write stats['assetsByChunkName'].to_json
    end
  end
end

Rake::Task['assets:precompile'].enhance(['webpack:compile'])