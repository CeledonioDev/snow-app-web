<template>
  <div class="companies">
    <h3>Lista de afiliados</h3>

    <div class="companies-table-div">
      
      <CompaniesList />

    </div>
  </div>
</template>
<script>

// @ is an alias to /src
import CompaniesList from '@/components/CompaniesList.vue'

export default {
  name: 'companies',
  components: {
    CompaniesList
  }
}
</script>
