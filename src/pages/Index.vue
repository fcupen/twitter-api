<template>
  <q-page class="row items-center justify-evenly">
    <example-component
      title="Example component"
      active
    ></example-component>
  </q-page>
</template>

<script lang="ts">
import ExampleComponent from 'components/ClassComponent.vue';
import { Vue, Options } from 'vue-class-component'

@Options({
  components: { ExampleComponent }
})
export default class PageIndex extends Vue {
};
</script>
