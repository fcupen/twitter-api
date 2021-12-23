<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>Social Networks Tool </q-toolbar-title>

        <div></div>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      :mini="true"
      :width="200"
      :breakpoint="500"
      bordered
      class="bg-grey-3"
    >
      <template v-slot:mini>
        <q-scroll-area class="fit mini-slot cursor-pointer">
          <div class="q-py-lg">
            <div class="column items-center">
              <EssentialLink
                v-for="link in essentialLinks"
                :key="link.title"
                v-bind="link"
              />
            </div>
          </div>
        </q-scroll-area>
      </template>
    </q-drawer>

    <q-page-container>
      <div>
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import EssentialLink from "components/EssentialLink.vue";

const linksList = [
  {
    title: "Twitter",
    caption: "Set tweets",
    icon: "fab fa-twitter",
  },
  {
    title: "Instagram",
    caption: "Set tweets",
    icon: "fab fa-instagram",
  },
  {
    title: "Stories",
    caption: "Set tweets",
    icon: "fas fa-swatchbook",
  },
];

import { Vue, Options } from "vue-class-component";

@Options({
  components: { EssentialLink },
})
export default class MainLayout extends Vue {
  leftDrawerOpen = false;
  essentialLinks = linksList;
  toggleLeftDrawer() {
    this.leftDrawerOpen = !this.leftDrawerOpen;
  }
}
</script>
