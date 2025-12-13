<template>
    <h1>You did it!</h1>
    <ul>
        <li v-for="(item, idx) in items" :key="item.id">{{ item.text }} : <input type="text" v-model="item.value" /></li>
    </ul>
    <button @click="shuffleItems">shuffle</button>
</template>

<script setup>
import { ref } from "vue";
const items = ref([
    { id: 1, text: "item 1", value: "1" },
    { id: 2, text: "item 2", value: "2" },
    { id: 3, text: "item 3", value: "3" },
]);

const shuffleItems = () => {
    shuffleArray(items.value);

    // items.value = shuffleArray([...items.value])
};

const shuffleArray = (arr) => {
    // fisher-yates 알고리즘으로 배열 무작위 섞음
    let curIdx = arr.length,
        randomIdx;
    while (curIdx !== 0) {
        randomIdx = Math.floor(Math.random() * curIdx);
        console.log(Math.random(), curIdx, Math.random() * curIdx);
        curIdx--;

        // 구조분해할당으로 배열 두 요소 서로 교환
        [arr[curIdx], arr[randomIdx]] = [arr[randomIdx], arr[curIdx]];
    }
    return arr;
};
</script>

<style scoped></style>
