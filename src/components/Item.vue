<template>
  <div>
    <q-item>
      <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
      </q-item-section>
      <q-item-section>
      <q-item-label>
        {{task.name}}
      </q-item-label>
      <q-item-label caption>
        {{task.mobile}}
      </q-item-label>
      </q-item-section>

      <q-item-section side>
          <q-btn
            @click.stop="$emit('activate',task.id)"
            color="green"
            icon="verified"
            flat
            round
            dense
          />
      </q-item-section>

    </q-item>
     <q-separator/>
    </div>
</template>

<script>

export default {
  props: ['task'],
}
</script>

