<template>
    <div v-if="isOwnerDashboard" class="d-flex flex-row">
        <div class="w-100">
            <div class="title">
                <h4>In Progress Auctions</h4>
            </div>
            <ul class="list-unstyled mb-0">
                <li v-for="(item,index) in auctions" :key="index" class="fullWidth owner_list">
                    {{index + 1}} - {{ item.title }} <b-badge class="badge_list">{{item.value}}</b-badge>
                </li>
            </ul>
        </div>
       
    </div>
    <div v-else class="d-flex flex-row">

        <div class="w-50">
            <div class="title">
                <h4>Marketrs</h4>
            </div>
            <ul class="list-unstyled mb-0">
                <li v-for="(item,index) in sides" :key="index" class="fullWidth">
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
                <li v-for="(item,index) in owners" :key="index" class="fullWidth">
                    <router-link :to="item.link">{{ item.title }} <b-badge class="badge" variant="light">{{item.auctionNumber}}</b-badge></router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import {getCurrentLanguage} from "../../utils"
export default {
    props: ['sides', 'owners', 'isOwnerDashboard', 'auctions'],
    data() {
        return {
            inprogressArray: [], 
            language: null,
        }
    },
    created() {
        console.log(this.auctions)
        this.language = getCurrentLanguage();
    },
  
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
.fullWidth{
    width: 100%;
    margin-bottom: 19px;
}
.badge{ 
    float: right;
}
.badge_list{ 
    float: right;
    font-size: 100% !important;
    padding: 4px !important;
    background-color: unset !important;
    color: #000;
}

.owner_list{
    border-radius: 10px;
    padding: 7px;
    font-weight: 700;
    background: #eee;
    cursor: pointer;
}
.owner_list:hover{
    border-radius: 10px;
    padding: 7px;
    font-weight: 700;
    background: #f7cf1f;
}
</style>
