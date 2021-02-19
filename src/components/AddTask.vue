<template>
  <q-input outlined bottom-slots v-model="newTaskTitle" :label="placeholder" clearable>

        <template v-slot:append>
          <q-btn round dense flat icon="add" @click="addTask"/>
        </template>
  </q-input>
</template>

<script>
export default {
    props: ['tasktype'],
  data() {
    return {
        placeholder :'Add ' + this.tasktype,
      newTaskTitle: ''
    }
  },
  computed: {
    newTaskTitleInvalid() {
      return !this.newTaskTitle
    }
  },
  methods: {
    addTask() {
      if (!this.newTaskTitleInvalid) {
        this.$emit('add',this.newTaskTitle)
        //this.$store.dispatch('addTask', this.newTaskTitle)
        this.newTaskTitle = ''
      }
    }
  }
}
</script>

<style lang="sass">
  .field-add-task.v-input--is-focused
    .v-input__slot
      background: rgba(31,94,129, 0.5)
</style>