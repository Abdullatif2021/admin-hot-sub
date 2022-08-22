<template>
<b-card :class="{'d-flex flex-row':true,'active' : 'selectedItems.includes(data.id)'}" no-body>
    <div class="pl-2 d-flex flex-grow-1 min-width-zero">
        <div class="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
           <img :src="data.icon" style="border-radius: 10px;" alt="image" class="mb-0 text-muted text-small w-10 w-sm-100"/>
           <p class="mb-0 text-muted text-small w-15 w-sm-100">{{data.name}}</p>
            <p class="mb-0 text-muted text-small w-15 w-sm-100">{{data.type === 'STRING' ? 'Text' : 'Number'}}</p>
            <p class="mb-0 text-muted text-small w-15 w-sm-100">{{data.value}}  {{data.unit ? ',' : ''}} {{data.unit ? data.unit : ''}}</p>
            <p class="mb-0 text-muted text-small w-15 w-sm-100">{{data.date}}</p>
        </div>
        
    </div>
</b-card>
</template>

<script>
export default {
    props: ['data'],
    methods: {
       
    }
}
</script>
