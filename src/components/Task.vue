<template>
  <div>
    <q-item>
      <q-item-section>
      <q-item-label>
        {{task.name}}
      </q-item-label>
      </q-item-section>

      <q-item-section side>
          <q-btn
            @click.stop="promptToDelete(task.name)"
            color="red"
            icon="delete"
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
  methods: {
    promptToDelete(name) {
			this.$q.dialog({
				title: 'Confirm',
				message: 'Really Delete?',
				cancel: true,
				persistent: true
			}).onOk(() => {
				this.$emit('delete',name)
			})
		}
  }
}
</script>

