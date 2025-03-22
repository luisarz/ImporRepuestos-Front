<template>
  <div class="grid" id="kt_remote_table" data-datatable="true">
    <div class="card card-grid min-w-full">
      <div class="card-header py-5 flex-wrap">
        <h1 class="card-title">
          Administración de Sucursales
        </h1>
        <label class="switch switch-sm">
          <button class="btn btn-primary" @click="openStoreModal()">
            <i class="ki-filled ki-plus-squared"></i>
            Aperturar Sucursal
          </button>
        </label>
      </div>
      <div class="card-body">
        <div>
          <div class="scrollable-x-auto">
            <table id="#table_modulo" class="table table-auto table-border" data-datatable-table="true">
              <thead>
              <tr>
                <th class="w-[100px] text-center" data-datatable-column="status">
                                        <span class="sort">
                                            <span class="sort-label">
                                                Tipo
                                            </span>
                                            <span class="sort-icon">
                                            </span>
                                        </span>
                </th>
                <th class="min-w-[60px]" data-datatable-column="ipAddress">
                                        <span class="sort">
                                            <span class="sort-label">
                                                Nombre
                                            </span>
                                            <span class="sort-icon">
                                            </span>
                                        </span>
                </th>
                <th class="min-w-[60px]" data-datatable-column="ipAddress">
                                        <span class="sort">
                                            <span class="sort-label">
                                                NRC
                                            </span>
                                            <span class="sort-icon">
                                            </span>
                                        </span>
                </th>
                <th class="min-w-[60px]" data-datatable-column="ipAddress">
                                        <span class="sort">
                                            <span class="sort-label">
                                                Distrito
                                            </span>
                                            <span class="sort-icon">
                                            </span>
                                        </span>
                </th>
                <th class="min-w-[60px]" data-datatable-column="ipAddress">
                                        <span class="sort">
                                            <span class="sort-label">
                                                Teléfono
                                            </span>
                                            <span class="sort-icon">
                                            </span>
                                        </span>
                </th>

                <th class="w-[60px]">
                </th>

              </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div
          class="card-footer justify-center md:justify-between flex-col md:flex-row gap-3 text-gray-600 text-2sm font-medium">
        <div class="flex items-center gap-2">
          Mostrar
          <select class="select select-sm w-16" data-datatable-size="true" name="perpage">
          </select>
          por Pagina
        </div>
        <div class="flex items-center gap-4">
          <span data-datatable-info="true"></span>
          <div class="pagination" data-datatable-pagination="true"></div>
        </div>
      </div>
    </div>
  </div>
  <LongModal id="modal_store" data-modal-backdrop-static="true" data-modal-autofocus="true" title="">

    <template #body>
      <input type="hidden" name="idwarehouse" v-model="warehouse.id">
      <div class="card">
        <div class="card-header">
          Aperturar Nueva Sucursal
        </div>
        <div class="card-body">
          <div class="grid grid-cols-2 gap-4">
            <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <label class="form-label max-w-32">
               Empresa
              </label>
              <div class="flex flex-col w-full gap-1">
                <select name="company_id" v-model="warehouse.company_id" data-control="select2"
                        data-search="true"
                        class="select  l">
                  <option v-for="company in companies" :key="company.id"
                          :value="company.id">
                    {{ company.company_name }}
                  </option>

                </select>

              </div>
            </div>

            <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <label class="form-label max-w-32">
                Tipo Establecimiento
              </label>
              <div class="flex flex-col w-full gap-1">
                <select name="stablishment_type" v-model="warehouse.stablishment_type" data-control="select2"
                        data-search="true"
                        class="select  l">
                  <option v-for="stablishment_types in stablishmentTypes" :key="stablishment_types.id"
                          :value="stablishment_types.id">
                  {{ stablishment_types.code }}
                  {{ stablishment_types.description }}
                  </option>

                </select>

              </div>
            </div>


            <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <label class="form-label max-w-32">
                Nombre Sucursal
              </label>
              <div class="flex flex-col w-full gap-1">
                <input class="input" @change="validationForm"
                       :class="{ 'border-danger': !form.name.validationSuccess }"
                       name="name" v-model="warehouse.name" placeholder="Nombre de la warehouse" type="text"
                       value=""/>
                <span class="form-hint text-danger" v-if="!form.name.validationSuccess"> * Campo Obligatorio</span>
              </div>
            </div>




            <div class="w-full">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label class="form-label max-w-32">
                  NRC
                </label>
                <div class="flex flex-col w-full gap-1">
                  <input class="input" @change="validationForm"
                         :class="{ 'border-danger': !form.nrc.validationSuccess }"
                         name="nrc" v-model="warehouse.nrc"
                         placeholder="nrc del menu " type="text" value=""/>
                  <span class="form-hint text-danger" v-if="!form.nrc.validationSuccess"> * Campo Obligatorio </span>
                </div>
              </div>
            </div>

            <div class="w-full">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label class="form-label max-w-32">
                  NIT
                </label>
                <div class="flex flex-col w-full gap-1">
                  <input class="input" @change="validationForm"
                         :class="{ 'border-danger': !form.nit.validationSuccess }"
                         name="nit" v-model="warehouse.nit"
                         placeholder="NIT de la warehouse " type="text" value=""/>
                  <span class="form-hint text-danger" v-if="!form.nit.validationSuccess"> * Campo Obligatorio </span>
                </div>
              </div>
            </div>


            <div class="w-full">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label class="form-label max-w-32">
                  Distrito
                </label>
                <div class="flex flex-col w-full gap-1">
                  <select name="district_id" v-model="warehouse.district_id" class="select select-sm w-full" >
                    <option v-for="district in districts" :key="district.id" :value="district.id">
                     {{district.code}} {{ district.description }}
                    </option>
                  </select>

                </div>
              </div>
            </div>


            <div class="w-full">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label class="form-label max-w-32">
                  Actividad económica
                </label>
                <div class="flex flex-col w-full gap-1">

                  <select name="economic_activity_id" class="select select-sm w-full">
                    <option v-for="econnommic_activity in economicActivities" :key="econnommic_activity.id"
                            :value="econnommic_activity.id" >
                      {{ econnommic_activity.code }}
                      {{ econnommic_activity.description }}</option>
                  </select>
                  <span class="form-hint text-danger"
                        v-if="!form.economic_activity_id.validationSuccess"> * Campo Obligatorio </span>
                </div>
              </div>
            </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label class="form-label max-w-32">
                  Dirección
                </label>
                <div class="flex flex-col w-full gap-1">
                  <input class="input" @change="validationForm"
                         :class="{ 'border-danger': !form.address.validationSuccess }"
                         name="address" v-model="warehouse.address"
                         placeholder="Direccion warehouse " type="text" value=""/>
                  <span class="form-hint text-danger"
                        v-if="!form.address.validationSuccess"> * Campo Obligatorio </span>

                </div>
              </div>

            <div class="w-full">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label class="form-label max-w-32">
                  Teléfono
                </label>
                <div class="flex flex-col w-full gap-1">
                  <input class="input" @change="validationForm"
                         name="phone" v-model="warehouse.phone"
                         placeholder="Teléfono warehouse " type="text" value=""/>
                  <span class="form-hint text-danger"
                        v-if="!form.phone.validationSuccess"> * Campo Obligatorio </span>
                </div>
              </div>
            </div>


            <div class="w-full">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label class="form-label max-w-32">
                  E-mail
                </label>
                <div class="flex flex-col w-full gap-1">
                  <input class="input" @change="validationForm"
                         :class="{ 'border-danger': !form.email.validationSuccess }"
                         name="email" v-model="warehouse.email"
                         placeholder="nrc del menu " type="text" value=""/>
                  <span class="form-hint text-danger"
                        v-if="!form.email.validationSuccess"> * Campo Obligatorio </span>
                </div>
              </div>
            </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label class="form-label max-w-32">
                 Precios por prodúcto
                </label>
                <div class="flex flex-col w-full gap-1">
                  <input class="input" @change="validationForm"
                         :class="{ 'border-danger': !form.product_prices.validationSuccess }"
                         name="product_prices" v-model="warehouse.product_prices"
                         placeholder="Pagina email" type="text" value=""/>
                  <span class="form-hint text-danger"
                        v-if="!form.product_prices.validationSuccess"> * Campo Obligatorio </span>

                </div>
              </div>




          </div><!--          end grid grid-2-->
          <div class="w-full py-2">
            <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <label class="form-label max-w-32">
                Logo
              </label>
              <div class=" w-full gap-1">
                <input class="input" @change="validationForm" :class="{ 'border-danger': !form.logo.validationSuccess }"
                         name="logo" v-model="warehouse.logo"
                       placeholder="Logo de la warehouse " type="text" value=""/>

              </div>
            </div>
          </div>

        </div><!--        End Body Card-->

      </div><!--      En card-->


    </template>
    <template #footer>
      <button class="btn btn-light" data-modal-dismiss="true">
        Cancel
      </button>
      <button class="btn btn-primary" @click="store()">
        Aperturar Sucursal
      </button>
    </template>
  </LongModal>
  <QuestionModal title="title" id="modal-question">
    <template #footer>
      <button class="btn btn-danger" @click="destroy()">
        Eliminar
      </button>
    </template>
  </QuestionModal>
</template>
<script src="./index.js"></script>
