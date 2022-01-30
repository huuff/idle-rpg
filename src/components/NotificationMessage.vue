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
    return notification.value ? `is-${notification?.value.level}` : "is-primary";
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