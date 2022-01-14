<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Ingresos</v-toolbar-title>
                <v-divider
                class="mx-2"
                inset
                vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-text-field class="text-xs-center" v-model="search" append-icon="search" 
                label="Búsqueda" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo</v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                        </v-card-title>
            
                        <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="nombre" label="Nombre"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-select v-model="rol" :items="roles" label="Rol">

                                    </v-select>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-select v-model="tipo_documento" :items="documentos" label="Tipo Docomento">

                                    </v-select>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="num_documento" label="Número Documento"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="direccion" label="Dirección"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="telefono" label="Teléfono"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="email" label="E-mail"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field type="password" v-model="password" label="Password"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12 v-show="valida">
                                    <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
                                </v-flex>
                            </v-layout>
                        </v-container>
                        </v-card-text>
            
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
                        <v-btn color="blue darken-1" flat @click="guardar">Guardar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>


                <!-- modal pergunta -->
                <v-dialog v-model="adModal" max-width="290">
                    <v-card>
                        <v-card-title class="headline" v-if="adAccion==1">Activar Item</v-card-title>
                        <v-card-title class="headline" v-if="adAccion==2">Desactivar Item</v-card-title>
                        <v-card-text>
                            Estás a punto de 
                            <span v-if="adAccion==1">activar</span>
                            <span v-if="adAccion==2">desactivar</span>
                            el item {{adNombre}}
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="green darken-1" flat="flat" @click="activarDesactivarCerrar()">Cancelar</v-btn>
                            <v-btn v-if="adAccion==1" color="orange darken-4" flat="flat" @click="activar()">Activar</v-btn>
                            <v-btn v-if="adAccion==2" color="orange darken-4" flat="flat" @click="desactivar()">Desactivar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>


            </v-toolbar>
            <v-data-table
                :headers="headers"
                :items="ingresos"
                :search="search"
                class="elevation-1"
            >
                <template v-slot:items="props">
                <td class="justify-center layout px-0">
                    <template v-if="props.item.estado">
                        <v-icon
                        small
                        @click="activarDesactivarMostrar(2, props.item)"
                        >
                            block
                        </v-icon>
                    </template>
                    <template v-else>
                        <v-icon
                        small
                        @click="activarDesactivarMostrar(1, props.item)"
                        >
                            check
                        </v-icon>
                    </template>
                </td>
                <td>{{ props.item.usuario.nombre }}</td>
                <td>{{ props.item.persona.nombre }}</td>
                <td>{{ props.item.tipo_comprobante }}</td>
                <td>{{ props.item.serie_comprobante }}</td>
                <td>{{ props.item.num_comprobante }}</td>
                <td>{{ props.item.createdAt }}</td>
                <td>{{ props.item.impuesto }}</td>
                <td>{{ props.item.total }}</td>
                <td>
                    <div v-if="props.item.estado">
                        <span class="blue--text">Aceptado</span>
                    </div>
                    <div v-else>
                        <span class="red--text">Anulado</span>
                    </div>
                </td>
                </template>
                <template v-slot:no-data>
                <v-btn color="primary" @click="listar()" >Reset</v-btn>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>
<script>
    import axios from 'axios'
    export default {
        data(){
            return{
                dialog: false,
                ingresos:[],
                search:'',
                headers: [
                { text: 'Opciones', value: 'opciones', sortable: true },
                { text: 'Usuario', value: 'usuario.nombre', sortable: true },
                { text: 'Proveedor', value: 'persona.nombre', sortable: true },
                { text: 'Tipo Comprobante', value: 'tipo_comprobante', sortable: true },
                { text: 'Serie Comprobante', value: 'serie_comprobante', sortable: true },
                { text: 'Número Comprobante', value: 'num_comprobante', sortable: true },
                { text: 'Fecha', value: 'createdAt', sortable: false },
                { text: 'Impuesto', value: 'impuesto', sortable: false },
                { text: 'total', value: 'total', sortable: false },
                { text: 'Estado', value: 'estado', sortable: false }
                ],
                desserts: [],
                editedIndex: -1,
                _id:'',
                nombre:'',
                rol:'',
                roles:['Administrador', 'Almacenero', 'Vendedor'],
                documentos:['DNI', 'RUC', 'PASAPORTE', 'CEDULA'],
                num_documento:'',
                tipo_documento:'',
                direccion:'',
                telefono:'',
                email:'',
                password:'',
                valida:0,
                validaMensaje:[],
                adModal:0,
                adAccion:0,
                adNombre:'',
                adId:''
            }
        },
        computed: {
            formTitle () {
            return this.editedIndex === -1 ? 'Nuevo registro' : 'Editar registro'
            }
        },
        watch: {
            dialog (val) {
            val || this.close()
            }
        },
        created () {
            this.listar()
        },
        methods: {
            listar(){
                let me = this
                let header={"Token": this.$store.state.token}
                let configuracion = {headers: header}
                axios.get('ingreso/list', configuracion).then(function(response){
                    //console.log(response)
                    me.ingresos = response.data
                }).catch(function(error){
                    console.log(error)
                })
            },
            validar(){
                this.valida = 0
                this.validaMensaje = []
                if(!this.rol){
                    this.validaMensaje.push('Seleccione un rol.')
                }
                if(this.nombre.length < 1 || this.nombre.length > 50){
                    this.validaMensaje.push('El nombre de usuário debe tener entre 1-50 caracteres')
                }
                /* if(this.descripcion.length > 255){
                    this.validaMensaje.push('La descripcion no deve tener mas de 255 caracteres')
                } */
                if(this.num_documento.length > 20){
                    this.validaMensaje.push('El documento no deve tener mas de 20 caracteres')
                }
                if(this.direccion.length > 70){
                    this.validaMensaje.push('La dirección no deve tener mas de 70 caracteres')
                }
                if(this.telefono.length > 20){
                    this.validaMensaje.push('El telefono no deve tener mas de 20 caracteres')
                }
                if(this.email.length < 1 || this.email.length > 50){
                    this.validaMensaje.push('El email de usuário debe tener entre 1-50 caracteres')
                }
                if(this.password.length < 1 || this.password.length > 64){
                    this.validaMensaje.push('El password de usuário debe tener entre 1-64 caracteres')
                }
                if(this.validaMensaje.length){
                    this.valida = 1
                }
                return this.valida
            },
            guardar(){
                let me = this
                let header={"Token": this.$store.state.token}
                let configuracion = {headers: header}

                if(this.validar()){
                    return
                }
                
                if(this.editedIndex > -1){
                    //editar
                    axios.put('usuario/update', {
                        '_id': this._id,
                        'rol':this.rol,
                        'nombre':this.nombre,
                        'tipo_documento':this.tipo_documento,
                        'num_documento':this.num_documento,
                        'direccion':this.direccion,
                        'telefono':this.telefono,
                        'email':this.email,
                        'password':this.password,
                    })
                    .then(function(response){
                        me.limpiar()
                        me.close()
                        me.listar()
                    })
                    .catch(function(){
                        console.log(error)
                    })
                } else {
                    //guardar
                    axios.post('usuario/add', {
                        'rol':this.rol,
                        'nombre':this.nombre,
                        'tipo_documento':this.tipo_documento,
                        'num_documento':this.num_documento,
                        'direccion':this.direccion,
                        'telefono':this.telefono,
                        'email':this.email,
                        'password':this.password,
                    }, configuracion)
                    .then(function(response){
                        me.limpiar()
                        me.close()
                        me.listar()
                    })
                    .catch(function(){
                        console.log(error.response)
                    })
                }
            },
            limpiar(){
                this._id = ''
                this.nombre = ''
                this.tipo_documento = ''
                this.tipo_documento = ''
                this.num_documento = ''
                this.direccion = ''
                this.telefono = ''
                this.email = ''
                this.password = ''
                this.valida = 0
                this.validaMensaje =[]
                this.editedIndex = -1
            },
            activarDesactivarMostrar(action, item){
                this.adModal = 1
                this.adNombre = item.nombre
                this.adId = item._id
                if(action == 1){
                    this.adAccion =1
                } else if(action == 2){
                    this.adAccion = 2
                } else {
                    this.adModal = 0
                }
            },
            activarDesactivarCerrar(){
                this.adModal = 0
            },
            activar(){
                let me = this
                axios.patch('usuario/activate',{'_id':this.adId})
                .then(function(response){
                        me.adModal=0
                        me.adAccion=0
                        me.adNombre=""
                        me.adId=""
                        me.listar()

                    })
                    .catch(function(){
                        console.log(error)
                    })
            },
            desactivar(){
                let me = this
                axios.patch('usuario/deactivate',{'_id':this.adId})
                .then(function(response){
                        me.adModal=0
                        me.adAccion=0
                        me.adNombre=""
                        me.adId=""
                        me.listar()

                    })
                    .catch(function(){
                        console.log(error)
                    })
            },
            editItem (item) {
                this._id = item._id
                this.rol = item.rol
                this.nombre = item.nombre
                this.tipo_documento = item.tipo_documento
                this.num_documento = item.num_documento
                this.direccion = item.direccion
                this.telefono = item.telefono
                this.email = item.email
                this.password = item.password
                this.dialog = true
                this.editedIndex = 1
            },

            deleteItem (item) {
            const index = this.desserts.indexOf(item)
            confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
            },

            close () {
                this.dialog = false
            },
        }
    }
</script>
