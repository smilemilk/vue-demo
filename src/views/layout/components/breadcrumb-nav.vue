<template>
    <Breadcrumb>
        <BreadcrumbItem
            v-for="item in currentPath"
            :href="item.path"
            :key="item.name"
        >{{ itemTitle(item) }}</BreadcrumbItem>
    </Breadcrumb>
</template>

<script>
export default {
    name: 'breadcrumbNav',
    props: {
        currentPath: Array
    },
    methods: {
        itemTitle (item) {
            console.log(item)
            if (typeof item.title === 'object') {
                return item.title.i18n;
            } else {
                return item.title;
            }
        }
    }
};
</script>

