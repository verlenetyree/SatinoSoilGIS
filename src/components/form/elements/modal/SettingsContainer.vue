<template>
  <a-input-group>
    <a-form-item label="X:" name="X_coords">
      <a-input v-model:value="this.$store.state.coords[1]" placeholder="X" />
    </a-form-item>
    <a-form-item label="Y:" name="Y_coords">
      <a-input v-model:value="this.$store.state.coords[0]" placeholder="Y" />
    </a-form-item>
  </a-input-group>
</template>

<script>
export default {};
</script>

<style scoped></style>
