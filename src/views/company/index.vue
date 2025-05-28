<template>
  <div class="grid" id="kt_remote_table" data-datatable="true">
    <div class="card card-grid min-w-full">
      <div class="card-header py-5 flex-wrap">
        <h1 class="card-title">
          Configuración de Empresas
        </h1>

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
                                                Logo
                                            </span>
                                            <span class="sort-icon">
                                            </span>
                                        </span>
                </th>
                <th class="min-w-[60px]" data-datatable-column="nombre">
                                        <span class="sort">
                                            <span class="sort-label">
                                                Nombre
                                            </span>
                                            <span class="sort-icon">
                                            </span>
                                        </span>
                </th>
                <th class="min-w-[60px]" data-datatable-column="nit">
                                        <span class="sort">
                                            <span class="sort-label">
                                                NIT
                                            </span>
                                            <span class="sort-icon">
                                            </span>
                                        </span>
                </th>
                <th class="min-w-[60px]" data-datatable-column="telefono">
                                        <span class="sort">
                                            <span class="sort-label">
                                                Telefono
                                            </span>
                                            <span class="sort-icon">
                                            </span>
                                        </span>
                </th>
                <th class="min-w-[60px]" data-datatable-column="email">
                                        <span class="sort">
                                            <span class="sort-label">
                                                email
                                            </span>
                                            <span class="sort-icon">
                                            </span>
                                        </span>
                </th>
                <th class="min-w-[60px]" data-datatable-column="whatsapp">
                                        <span class="sort">
                                            <span class="sort-label">
                                                whatsapp
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

  <LongModal id="modal_edit" data-modal-backdrop-static="true" data-modal-autofocus="true" title="">

    <template #body>
      <input type="hidden" name="idmodulo" v-model="empresa.id">
      <div class="card">
        <div class="card-header"><h3 class="card-title">Modificar empresa</h3></div>
        <div class="card-body">
          <div class="grid grid-cols-2 gap-4">
            <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <label class="form-label max-w-32">
                Empresa
              </label>
              <div class="flex flex-col w-full gap-1">
                <input class="input" @change="validationForm"
                       :class="{ 'border-danger': !form.company_name.validationSuccess }"
                       name="company_name" v-model="empresa.company_name" placeholder="Nombre de la empresa" type="text"
                       value=""/>
                <span class="form-hint text-danger"
                      v-if="!form.company_name.validationSuccess"> * Campo Obligatorio</span>
              </div>
            </div>
            <div class="w-full">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label class="form-label max-w-32">
                  Rubro
                </label>
                <div class="flex flex-col w-full gap-1">
                  <select name="economic_activity_id" v-model="empresa.economic_activity_id" data-control="select2"
                          class="select  select2-sm w-full">
                    <option v-for="economic_activities in economicActivities" :key="economic_activities.id"
                            :value="economic_activities.id">
                      {{ economic_activities.description }}
                    </option>
                  </select>

                </div>
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
                         name="nrc" v-model="empresa.nrc"
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
                         name="nit" v-model="empresa.nit"
                         placeholder="NIT de la empresa " type="text" value=""/>
                  <span class="form-hint text-danger" v-if="!form.nit.validationSuccess"> * Campo Obligatorio </span>
                </div>
              </div>
            </div>
            <div class="w-full">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label class="form-label max-w-32">
                  Teléfono
                </label>
                <div class="flex flex-col w-full gap-1">
                  <input class="input" @change="validationForm"
                         name="phone" v-model="empresa.phone"
                         placeholder="Teléfono empresa " type="text" value=""/>
                  <span class="form-hint text-danger" v-if="!form.phone.validationSuccess"> * Campo Obligatorio </span>
                </div>
              </div>
            </div>
            <div class="w-full">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label class="form-label max-w-32">
                  Whatsapp
                </label>
                <div class="flex flex-col w-full gap-1">
                  <input class="input" @change="validationForm"
                         :class="{ 'border-danger': !form.whatsapp.validationSuccess }"
                         name="whatsapp" v-model="empresa.whatsapp"
                         placeholder="nrc del menu " type="text" value=""/>
                  <span class="form-hint text-danger"
                        v-if="!form.whatsapp.validationSuccess"> * Campo Obligatorio </span>
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
                         name="email" v-model="empresa.email"
                         placeholder="nrc del menu " type="text" value=""/>
                  <span class="form-hint text-danger" v-if="!form.email.validationSuccess"> * Campo Obligatorio </span>
                </div>
              </div>
            </div>
            <div class="w-full">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label class="form-label max-w-32">
                  Distrito
                </label>
                <div class="flex flex-col w-full gap-1">
                  <select name="district_id" v-model="empresa.district_id" class="select select-sm w-full">
                    <option v-for="district in districts" :key="district.id" :value="district.id">
                      {{ district.description }}
                    </option>
                  </select>

                </div>
              </div>
            </div>
            <div class="w-full">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label class="form-label max-w-32">
                  Dirección
                </label>
                <div class="flex flex-col w-full gap-1">
                  <input class="input" @change="validationForm"
                         :class="{ 'border-danger': !form.address.validationSuccess }"
                         name="address" v-model="empresa.address"
                         placeholder="Direccion empresa " type="text" value=""/>

                </div>
              </div>
            </div>
            <div class="w-full">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label class="form-label max-w-32">
                  Pagina web
                </label>
                <div class="flex flex-col w-full gap-1">
                  <input class="input" @change="validationForm"
                         :class="{ 'border-danger': !form.web.validationSuccess }"
                         name="web" v-model="empresa.web"
                         placeholder="Pagina web" type="text" value=""/>

                </div>
              </div>
            </div>
            <div class="w-full">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label class="form-label max-w-32">
                  API KEY
                </label>
                <div class="flex flex-col w-full gap-1">
                  <input class="input" @change="validationForm"
                         :class="{ 'border-danger': !form.api_key_mh.validationSuccess }"
                         name="api_key_mh" v-model="empresa.api_key_mh"
                         placeholder="Api Key hacienda " type="password" value=""/>

                </div>
              </div>
            </div>
            <div class="w-full">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label class="form-label max-w-32">
                  Logo
                </label>
                <div class="flex flex-col w-full gap-1">
                  <input class="input" @change="validationForm"
                         :class="{ 'border-danger': !form.logo.validationSuccess }"
                         name="logo" v-model="empresa.logo"
                         placeholder="Logo de la empresa " type="text" value=""/>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </template>
    <template #footer>
      <button class="btn btn-light" data-modal-dismiss="true">
        Cancel
      </button>
      <button class="btn btn-primary" @click="updateModule()">
        Guardar Cambios
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
<script>
import {ref, nextTick, onMounted} from 'vue';
import {KTDataTable, KTModal} from './../../metronic/core/index';
import GeneralModal from '@/components/GeneralModal.vue';
import QuestionModal from '../../components/QuestionModal.vue';
import companyService from "@/services/CompanyService";
import LongModal from "@/components/LongModal.vue";

export default {
  components: {LongModal, GeneralModal, QuestionModal},
  data() {
    return {
      loading: false,
      empresa: {
        id: 0,
        district_id: 0,
        economic_activity_id: 0,
        company_name: '',
        nrc: '',
        nit: '',
        phone: '',
        whatsapp: '',
        email: '',
        address: '',
        web: '',
        api_key_mh: '',
        logo: '',
        is_active: 0,
      },
      districts: {
        id: 0,
        description: '',
      },
      economicActivities: [],
      form: Object.fromEntries(
          Object.keys({
            id: 0,
            district_id: 0,
            economic_activity_id: 0,
            company_name: '',
            nrc: '',
            nit: '',
            phone: '',
            whatsapp: '',
            email: '',
            address: '',
            web: '',
            api_key_mh: '',
            logo: '',
            is_active: 0,
          }).map(field => [field, {isrequired: true, validationSuccess: true}])
      )
    };


  },
  methods: {

    async updateModule() {
      try {
        if (!this.validationForm()) return;
        if (this.loading) return;
        this.loading = true;
        await companyService.update(this.empresa)
        this.loading = false;
        window.location.reload()

      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    validationForm() {
      this.form.id.validationSuccess = Number.isInteger(this.empresa.id);
      this.form.district_id.validationSuccess = Number.isInteger(this.empresa.district_id);
      this.form.economic_activity_id.validationSuccess = Number.isInteger(this.empresa.economic_activity_id);
      this.form.company_name.validationSuccess = this.empresa.company_name.trim() !== '';
      this.form.nrc.validationSuccess = this.empresa.nrc.trim() !== '';
      this.form.nit.validationSuccess = this.empresa.nit.trim() !== '';
      this.form.phone.validationSuccess = this.empresa.phone.trim() !== '';
      this.form.whatsapp.validationSuccess = this.empresa.whatsapp.trim() !== '';
      this.form.email.validationSuccess = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.empresa.email); // Validación de email
      this.form.address.validationSuccess = this.empresa.address.trim() !== '';
      // this.form.web.validationSuccess = this.empresa.web.trim() !== '';
      this.form.api_key_mh.validationSuccess = this.empresa.api_key_mh.trim() !== '';
      this.form.logo.validationSuccess = this.empresa.logo.trim() !== '';
      // this.form.is_active.validationSuccess = typeof this.empresa.is_active === 'boolean';
      return Object.values(this.form).every(field => field.validationSuccess);

    },
    async destroy() {
      if (this.loading) return;
      this.loading = true;
      await companyService.destroy(this.empresa.id);
      this.loading = false;
      window.location.reload();
    },
    deleteRow(id) {
      const modalElement = document.querySelector("#modal-question");
      const modal = KTModal.getInstance(modalElement);
      modal.show();
      this.empresa.id = id;
    },
    async editRow(data) {
      const modalElement = document.querySelector("#modal_edit");
      const modal = KTModal.getInstance(modalElement);
      modal.show();
      const company = await companyService.getOne(data.id);
      this.districts = company.data.district;
      this.economicActivities = company.data.economic_activity;

      this.empresa.id = data.id;
      this.empresa.district_id = data.district_id;
      this.empresa.economic_activity_id = data.economic_activity_id;
      this.empresa.company_name = data.company_name;
      this.empresa.nrc = data.nrc;
      this.empresa.nit = data.nit;
      this.empresa.phone = data.phone;
      this.empresa.whatsapp = data.whatsapp;
      this.empresa.email = data.email;
      this.empresa.address = data.address;
      this.empresa.web = data.web;
      this.empresa.api_key_mh = data.api_key_mh;
      this.empresa.logo = data.logo;
      // this.empresa.is_active = data.is_active;

    },
    async initDataTable() {
      const tableElement = document.querySelector("#kt_remote_table");
      const options = {
        apiEndpoint: companyService.getUrl(),
        requestHeaders: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
        columns: {
          logo: {
            title: 'Logo'
          },
          company_name: {
            title: 'Empresa'
          },

          nrc: {
            title: 'NRC',
          },
          nit: {
            title: 'NIT',
          },
          phone: {
            title: 'Teléfono',
          },
          whatsapp: {
            title: 'WhatsApp',
          },


          edit: {
            render: () => `<i class="ki-outline ki-notepad-edit text-lg text-primary"></i>`,
            createdCell(cell, cellData, rowData) {
              cell.addEventListener('click', function () {
                editRow(rowData);
              });
            },
          },

        },

        layout: {
          scroll: false,
        },
        sortable: true,
      };
      new KTDataTable(tableElement, options);
    }
  },
  async mounted() {
    window.editRow = this.editRow.bind(this);
    this.$nextTick(() => {
      this.initDataTable();
    });
  },
};
onMounted(async () => { // Cargamos las categorías al montar el componente
  nextTick(() => {
    KTDataTable.init();
    KTModal.init();
  });
});
</script>