module.exports = {
    chainWebpack: config => {
        config.when(process.env.NODE_ENV === 'production', config=> {
            config.entry('app').clear().add('./src/main-pro.js')
        })
        config.when(process.env.NODE_ENV === 'development', config=> {
            config.entry('app').clear().add('./src/main-dev.js')
        })
    }

}
