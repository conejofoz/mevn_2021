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
                <v-text-field v-if="verNuevo==0" class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
                <v-btn @click="mostrarNuevo" color="primary" dark class="mb-2" v-if="verNuevo==0">Nuevo</v-btn>
                <!-- MODAL CONSULTA ARTICULOS -->
                <v-dialog v-model="dialog" max-width="1000px">
                    
                    <v-card>
                        <v-card-title>
                            <span class="headline">Seleccione un articulo</span>
                        </v-card-title>
            
                        <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm12 md12 lg12 xl12>

                                    <v-text-field 
                                        v-model="texto" @keyup.enter="listarArticulos()" 
                                        class="text-xs-center" append-icon="search" label="Búsqueda">
                                    </v-text-field>

                                    <template>
                                        <v-data-table
                                            :headers="cabeceraArticulos"
                                            :items="articulos"
                                            class="elevation-1"
                                        >
                                            <template v-slot:items="props">
                                            <td class="justify-center layout px-0">
                                                <v-icon
                                                small
                                                class="mr-2"
                                                @click="agregarDetalle(props.item)"
                                                >
                                                add
                                                </v-icon>
                                            </td>
                                            <td>{{ props.item.codigo }}</td>
                                            <td>{{ props.item.nombre }}</td>
                                            <td>{{ props.item.categoria.nombre }}</td>
                                            <td>{{ props.item.stock }}</td>
                                            <td>{{ props.item.precio_venta }}</td>
                                            <td>{{ props.item.description }}</td>
                                            <td>
                                                <div v-if="props.item.estado">
                                                    <span class="blue--text">Activo</span>
                                                </div>
                                                <div v-else>
                                                    <span class="red--text">Inactivo</span>
                                                </div>
                                            </td>
                                            </template>
                                            
                                        </v-data-table>
                                    </template>
                                </v-flex>
                            </v-layout>
                        </v-container>
                        </v-card-text>
            
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
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
                v-if="verNuevo==0"
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


            <!-- formulario de nova compra -->
            
            <!-- formulario de nova cabecera -->
            <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
                <v-layout row wrap>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-select v-model="tipo_comprobante" :items="comprobantes" label="Tipo Comprobante">

                        </v-select>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field v-model="serie_comprobante" label="Serie Comprobante"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field v-model="num_comprobante" label="Número Comprobante"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm8 md8 lg8 xl8>
                        <v-autocomplete v-model="persona" :items="personas" label="Proveedor"></v-autocomplete>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field type="number" v-model="impuesto" label="Impuesto"></v-text-field>
                    </v-flex>


                    <v-flex xs12 sm8 md8 lg8 xl8>
                        <v-text-field v-model="codigo" label="Código" @keyup.enter="buscarCodigo()"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 md2 lg2 xl2>
                        <v-btn small fab dark color="teal" @click="mostrarModalArticulos()">
                            <v-icon dark>list</v-icon>
                        </v-btn>
                    </v-flex>
                    <v-flex xs12 sm2 md2 lg2 xl2 v-show="errorArticulo">
                        <div class="red--text" v-text="errorArticulo"></div>
                    </v-flex>
                    
                    <!-- detalles de ingreso -->
                    <v-flex xs12 sm12 md12 lg12 xl12>
                        <template>
                            <v-data-table :headers="cabeceraDetalles" :items="detalles" class="elevation-1">
                                <template slot="items" slot-scope="props">
                                    <td><v-icon small class="mr-2" @click="eliminarDetalle(detalles, props.item)">delete</v-icon></td>
                                    <td class="text-xs-center">{{props.item.articulo}}</td>
                                    <!-- <td class="text-xs-center">{{props.item.cantidad}}</td> -->
                                    <td class="text-xs-center"><v-text-field v-model="props.item.cantidad" type="number"></v-text-field></td>
                                    <!-- <td class="text-xs-center">{{props.item.precio}}</td> -->
                                    <td class="text-xs-center"><v-text-field v-model="props.item.precio" type="number"></v-text-field></td>
                                    <td class="text-xs-center">{{props.item.cantidad * props.item.precio}}</td>
                                </template>
                                <template slot="no-data">
                                    <h3>No hay artículos agregados al detalle</h3>
                                </template>
                            </v-data-table>
                            <v-flex class="text-xs-right">
                                <strong>Total Parcial:</strong> $ {{totalParcial=(total-totalImpuesto).toFixed(2)}}
                            </v-flex>
                            <v-flex class="text-xs-right">
                                <strong>Total Impuesto:</strong> $ {{totalImpuesto=((total*impuesto)/(1+impuesto)).toFixed(2)}}
                            </v-flex>
                            <v-flex class="text-xs-right">
                                <strong>Total Neto:</strong> $ {{total=calcularTotal}}
                            </v-flex>
                        </template>
                    </v-flex>
                    <v-flex xs12 sm12 md12 v-show="valida">
                        <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
                    </v-flex>


                    <v-flex xs12 sm12 md12 lg12 xl12>
                        <v-btn color="blue darken-1" flat @click.native="ocultarNuevo()">Cancelar</v-btn>
                        <v-btn color="success" flat @click.native="guardar()">Guardar</v-btn>
                    </v-flex>

                </v-layout>
            </v-container>
            

            
            <!-- end formulario de nova compra -->







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
                persona:'',
                personas:[],
                tipo_comprobante:'',
                comprobantes:['BOLETA', 'FACTURA', 'TICKET', 'GUIA'],
                serie_comprobante:'',
                num_comprobante:'',
                impuesto:0.18,
                codigo:'',
                cabeceraDetalles:[
                    { text: 'Borrar', value: 'borrar', sortable: false},
                    { text: 'Artículo', value: 'articulo', sortable: false},
                    { text: 'Cantidad', value: 'cantidad', sortable: false},
                    { text: 'Precio', value: 'precio', sortable: false},
                    { text: 'Sub Total', value: 'subtotal', sortable: false},
                ],
                detalles:[
                    //{_id: '1000', articulo: 'Articulo 1', cantidad: '5', precio: '10'},
                    //{_id: '2000', articulo: 'Articulo 2', cantidad: '5', precio: '20'}
                ],
                verNuevo:0,
                errorArticulo:null,
                total:0,
                totalParcial:0,
                totalImpuesto:0,
                articulos:[],
                texto:'',
                cabeceraArticulos: [
                { text: 'Seleccionar', value: 'seleccionar', sortable: false },
                { text: 'Código', value: 'codigo', sortable: false },
                { text: 'Nombre', value: 'nombre', sortable: true },
                { text: 'Categoria', value: 'categoria.nombre', sortable: true },
                { text: 'Stock', value: 'stock', sortable: false },
                { text: 'Precio Venta', value: 'precio_venta', sortable: false },
                { text: 'Descripcion', value: 'descripcion', sortable: false },
                { text: 'Estado', value: 'estado', sortable: false }
                ],
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
            },
            calcularTotal:function(){
                let resultado = 0.0
                for (let i = 0; i < this.detalles.length; i++) {
                    resultado=resultado+(this.detalles[i].cantidad*this.detalles[i].precio);
                }
                return resultado
            }
        },
        watch: {
            dialog (val) {
            val || this.close()
            }
        },
        created () {
            this.listar()
            this.selectPersona()
        },
        methods: {
            selectPersona(){
                let me = this
                let personaArray = []
                let header={"Token": this.$store.state.token}
                let configuracion = {headers: header}
                axios.get('persona/listProveedores', configuracion).then(function(response){
                    personaArray = response.data
                    personaArray.map(function(x){
                        me.personas.push({text:x.nombre, value:x._id})
                    })
                }).catch(function(error){
                    console.log(error)
                })
            },
            buscarCodigo(){
                let me = this
                me.errorArticulo = null
                let header={"Token": this.$store.state.token}
                let configuracion = {headers: header}
                axios.get('articulo/queryCodigo?codigo='+this.codigo, configuracion).then(function(response){
                    //console.log(response)
                    me.agregarDetalle(response.data)
                }).catch(function(error){
                    //console.log(error)
                    me.errorArticulo = 'No existe el articulo'
                })
            },
            agregarDetalle(data){
                this.errorArticulo=null
                if(this.encuentra(data._id)==true){
                    this.errorArticulo = 'El articulo ya ha sido agregado'
                } else {
                    this.detalles.push(
                        {
                            _id:data._id,
                            articulo:data.nombre,
                            cantidad:1,
                            precio:data.precio_venta
                        }
                    )
                    this.codigo = ''
                }
            },
            encuentra(id){
                let sw = 0
                for (var i = 0; i < this.detalles.length; i++) {
                    if(this.detalles[i]._id==id){
                        sw=true
                    }
                    
                }
                return sw
            },
            eliminarDetalle(detalle, item){
                let i=detalle.indexOf(item)
                if(i!= -1){
                    detalle.splice(i,1)
                }
            },
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
            listarArticulos(){
                let me = this
                let header={"Token": this.$store.state.token}
                let configuracion = {headers: header}
                axios.get('articulo/list?valor='+this.texto, configuracion).then(function(response){
                    me.articulos = response.data
                }).catch(function(error){
                    console.log(error)
                })
            },
            mostrarModalArticulos(){
                this.dialog = 1
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
            mostrarNuevo(){
                this.verNuevo = 1
            },
            ocultarNuevo(){
                this.verNuevo = 0
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
