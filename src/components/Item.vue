<template>
  <div class="row q-pa-md">
      <q-input class="col" :label="task.key1"  v-model="task.value">
      </q-input>
          <q-btn align="right"
            @click.stop="$emit('activate',task)"
            color="green"
            icon="check"
            flat
          />

    </div>
</template>

<script>

export default {
  props: ['task'],
}
</script>

