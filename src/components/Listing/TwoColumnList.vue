<template>
<div class="d-flex flex-row">

    <div class="w-50">
        <div class="title">
            <h4>Marketrs</h4>
        </div>
        <ul class="list-unstyled mb-0">
            <li v-for="(item,index) in sides" :key="index" class="mb-1">
                <router-link to="">{{ item.title }}</router-link>
            </li>
        </ul>
    </div>
    <div class="vl"></div>
    <div class="w-50">
        <div class="title">
            <h4>Owners</h4>
        </div>
        <ul class="list-unstyled mb-0">
            <li v-for="(item,index) in owners" :key="index" class="mb-1">
                <router-link :to="item.link">{{ item.title }}</router-link>
            </li>
        </ul>
    </div>
</div>
</template>

<script>
export default {
    props: ['sides', 'owners']
}
</script>
<style scoped>
.vl {
    border-left: 1px solid rgb(204 204 204);
    height: 300px;
    margin: 40px 18px;
}
.title {
    margin-bottom: 23px;
    font-weight: 900;
}

</style>
