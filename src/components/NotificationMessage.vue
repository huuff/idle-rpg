<template>
    <div v-if="notification"
        :class="colorClass"
        class="notification">
        <button class="delete" @click="removeNotification"></button>
        {{ notification.message }}
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useNotificationStore } from "@/notification/notification-store";
import { storeToRefs } from "pinia";

const { notification } = storeToRefs(useNotificationStore());

const colorClass = computed(() => {
    if (notification?.value?.level === "success")
        return "is-success";
    else if (notification?.value?.level === "error")
        return "is-danger";
    else if (notification?.value?.level === "warning")
        return "is-warning";
    else if (notification?.value?.level === "info")
        return "is-info";
    else
       throw new Error(`Notification ${JSON.stringify(notification)} not handled!`)
})

function removeNotification() {
    notification.value = undefined;
}
</script>

<style scoped>
.notification {
    position: fixed;
    width: 500px;
    top: 10px;
    left: 50%;
    margin-left: -250px;
    z-index: 999;
}
</style>