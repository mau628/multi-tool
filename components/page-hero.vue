<template>
  <section class="hero is-info">
    <div class="hero-body">
      <p class="title">{{ title }}</p>
      <p class="subtitle">{{ subtitle }}</p>
    </div>
  </section>
  <br>
</template>

<script
  lang="ts"
  setup
>
const route = useRoute()

const title = computed(() => props.title || route.name as string)
const subtitle = computed(() => props.subtitle || '')

const props = defineProps({
  title: String,
  subtitle: String
})
</script>
