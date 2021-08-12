<template>
  <q-item clickable v-ripple :href="link">
    <q-icon :name="icon" class="mini-icon" />
  </q-item>
</template>

<script lang="ts">
import { Vue, prop, Options } from "vue-class-component";

class Props {
  readonly title!: string;
  readonly caption = prop({ default: "" });
  readonly link = prop({ default: "#" });
  readonly icon = prop({ default: "" });
}

@Options({})
export default class EssentialLink extends Vue.with(Props) {}
</script>
<style lang="sass" scoped>
.mini-icon
  font-size: 1.718em
  color: #1976d2
  & + &
    margin-top: 18px
</style>
