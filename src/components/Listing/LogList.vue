<template>
<table class="table table-sm table-borderless">
    <tbody>
        <tr v-for="(log, index) in logs" :log="log" :key="index">
            <td>
                <span :class="`log-indicator align-middle round_${log.type}`" />
            </td>
            <td>
                <span class="font-weight-medium">{{ log.type }} {{log.ref_type}}  <span class="clickable" @click="open_element(log.ref_id)">{{log.title}}</span> by <span class="clickable" @click="open_user(log.user_id)">{{log.message}}</span></span>
            </td>
            <td class="text-right">
                <span class="text-muted">{{ log.date }}</span>
            </td>
        </tr>
    </tbody>
</table>
</template>

<script>
import router from "../../router";
export default {
    props: ['logs'],
    methods: {
        open_user(link){
            router.push(link);
        },
        open_element(link){
            console.log(link);
            router.push(link);
        }
    }
}
</script>
<style scoped>
.round_Add {
    color: 'border-theme-2'
}
.clickable {
    cursor: pointer;

}
.clickable:hover {
    color: #0011b1;
    text-decoration: underline;
    transition: all .5s ease;
    -webkit-transition: all .5s ease;
}
</style>
