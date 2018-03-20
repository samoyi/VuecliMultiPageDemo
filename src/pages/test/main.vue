<template>
    <div id="wrapper">
        <img src="../../assets/logo.png">
        <h1>This is {{curPage}}</h1>
        <h1>To <a :href="linkTo">{{ linkTo }}</a></h1>
    </div>
</template>

<script>

console.log(typeof $); // undefined

export default {
    data () {
        return {
            curPage: 'test.html',
            linkTo: 'index.html'
        }
    }
}
</script>

<style lang="scss">
#wrapper {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

h1, h2 {
    font-weight: normal;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
</style>
