const ghpages = require('gh-pages')

// replace with your repo url
ghpages.publish(
  'build', //Path
  {
    branch: 'master',
    dest : 'mascotas', 
    repo: 'https://github.com/josesalasni/josesalasni.github.io',
  },
  () => {
    console.log('Deploy Complete!')
  }
)
