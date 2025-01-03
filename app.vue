<template>
  <b-navbar
    :fixed-top="true"
    type="is-dark"
  >

    <template #brand>
      <b-navbar-item
        tag="router-link"
        to="/"
      >
        <b-icon
          icon="hammer-sickle"
          type="is-success"
        ></b-icon>&nbsp;
        <strong><span class="has-text-primary">Multi</span><span class="has-text-secondary">Tool</span></strong>
      </b-navbar-item>
    </template>

    <template #start>
      <b-navbar-item
        tag="router-link"
        to="/calculo-amazon"
      >
        <b-icon
          icon="calculator"
          type="is-info"
          size="is-small"
        ></b-icon>&nbsp;
        Calculo Amazon
      </b-navbar-item>

    </template>

  </b-navbar>
  <div class="block">
    <div class="container">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
  <PageLoader />
</template>
