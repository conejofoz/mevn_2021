<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Ventas</v-toolbar-title>
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
                                                <td>{{ props.item.descripcion }}</td>
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


                <!-- modal pergunta ativar desativar -->
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

                <!-- modal pdf venta -->
                <v-dialog v-model="comprobanteModal" max-width="1000px">
                    <v-card>
                        <v-card-title>
                            <v-btn @click="crearPDF()"><v-icon>print</v-icon></v-btn> Reporte de venta
                        </v-card-title>
                        <v-card-text>
                            <div id="factura">
                                <header>
                                    <div id="logo">
                                        <img src="data:image/png;base64,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" id="imagen">
                                    </div>
                                    <div id="datos">
                                        <p id="encabezado">
                                            <b>Infinity Group S.A.</b><br>Av. San Blás, 136 - Ciudad del Este, Paraguay<br>Telefono:(+595)512216<br>Email:infinity@gmail.com
                                        </p>
                                    </div>
                                    <div id="fact">
                                        <p>{{tipo_comprobante}}<br>
                                        {{serie_comprobante}}-{{num_comprobante}}<br>
                                        {{fecha}}</p>
                                    </div>
                                </header>
                                <br>
                                <section>
                                    <div>
                                        <table id="facliente">
                                            <tbody>
                                                <tr>
                                                    <td id="cliente">
                                                        <strong>Sr(a). {{persona.nombre}}</strong><br>
                                                        <strong>Documento:</strong> {{persona.num_documento}}<br>
                                                        <strong>Dirección:</strong> {{persona.direccion}}<br>
                                                        <strong>Teléfono:</strong> {{persona.telefono}}<br>
                                                        <strong>Email:</strong> {{persona.email}}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                                <br>
                                <section>
                                <div>
                                    <table id="facarticulo">
                                        <thead>
                                            <tr id="fa">
                                                <th>CANT</th>
                                                <th>DESCRIPCION</th>
                                                <th>PRECIO UNIT</th>
                                                <th>DESC.</th>
                                                <th>PRECIO TOTAL</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="det in detalles" :key="det._id">
                                                <td style="text-align:center;">det.cant</td>
                                                <td>{{det.articulo}}</td>
                                                <td style="text-align:right;">{{det.precio}}</td>
                                                <td style="text-align:right;">{{det.descuento}}</td>
                                                <td style="text-align:right;">{{(det.cantidad*det.precio)-det.descuento}}</td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th style="text-align:right;">SUBTOTAL</th>
                                                <th style="text-align:right;">$ {{totalParcial = (total-totalImpuesto).toFixed(2) }}</th>
                                            </tr>
                                            <tr>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th style="text-align:right;">IVA({{impuesto}}%)</th>
                                                <th style="text-align:right;">$ {{totalImpuesto = ((total*impuesto)/(1+impuesto)).toFixed(2)}}</th>
                                            </tr>
                                            <tr>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th style="text-align:right;">TOTAL</th>
                                                <th style="text-align:right;">$ {{total = calcularTotal}}</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                </section>
                                <br>
                                <br>
                                <footer>
                                    <div id="gracias">
                                        <p><b>Gracias por su compra!</b></p>
                                    </div>
                                </footer>
                            </div>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn @click="ocultarComprobante()" color="blue darken-1" flat>Cancelar</v-btn> 
                        </v-card-actions>
                    </v-card>

                </v-dialog>

            </v-toolbar>

            <!-- Listado de toda las ventas -->
            <v-data-table
                :headers="headers"
                :items="ventas"
                :search="search"
                class="elevation-1"
                v-if="verNuevo==0"
            >
                <template v-slot:items="props">
                <td class="justify-center layout px-0">
                    <v-icon small class="mr-2" @click="verVenta(props.item)">
                        tab
                    </v-icon>
                    <v-icon small class="mr-2" @click="mostrarComprobante(props.item)">
                        print
                    </v-icon>
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
                        <v-autocomplete v-model="persona" :items="personas" label="Cliente"></v-autocomplete>
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
                    
                    <!-- detalles de venta -->
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
                                    <td class="text-xs-center"><v-text-field v-model="props.item.descuento" type="number"></v-text-field></td>
                                    <td class="text-xs-center">{{(props.item.cantidad * props.item.precio) - props.item.descuento}}</td>
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
                        <v-btn color="success" v-if="verDetalle==0" flat @click.native="guardar()">Guardar</v-btn>
                    </v-flex>

                </v-layout>
            </v-container>
            

            
            <!-- end formulario de nova compra -->







        </v-flex>
    </v-layout>
</template>
<script>
    import axios from 'axios'
    import jsPDF from 'jspdf'
    import html2canvas from 'html2canvas'
    export default {
        data(){
            return{
                dialog: false,
                ventas:[],
                search:'',
                headers: [
                { text: 'Opciones', value: 'opciones', sortable: true },
                { text: 'Usuario', value: 'usuario.nombre', sortable: true },
                { text: 'Cliente', value: 'persona.nombre', sortable: true },
                { text: 'Tipo Comprobante', value: 'tipo_comprobante', sortable: true },
                { text: 'Serie Comprobante', value: 'serie_comprobante', sortable: true },
                { text: 'Número Comprobante', value: 'num_comprobante', sortable: true },
                { text: 'Fecha', value: 'createdAt', sortable: false },
                { text: 'Impuesto', value: 'impuesto', sortable: false },
                { text: 'total', value: 'total', sortable: false },
                { text: 'Estado', value: 'estado', sortable: false }
                ],
                desserts: [],
                
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
                    { text: 'Descuento', value: 'descuento', sortable: false},
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
                verDetalle:0,
                valida:0,
                validaMensaje:[],
                adModal:0,
                adAccion:0,
                adNombre:'',
                adId:'',
                comprobanteModal:0,
                fecha:null
            }
        },
        computed: {
          
            calcularTotal:function(){
                let resultado = 0.0
                for (let i = 0; i < this.detalles.length; i++) {
                    resultado=resultado+((this.detalles[i].cantidad*this.detalles[i].precio)-this.detalles[i].descuento);
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
            crearPDF3(){
                var quotes = document.getElementById('factura');
                html2canvas(quotes).then(function (canvas) {
                    var imgData = canvas.toDataURL('image/png');
                    var imgWidth = 210;
                    var pageHeight = 295;

                    var imgHeight = canvas.height * imgWidth / canvas.width;
                    var heightLeft = imgHeight;
                    
                    var doc = new jsPDF('p', 'mm', 'a4');
                    var position = 0;

                    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;

                    while (heightLeft >= 0) {
                        position = heightLeft - imgHeight;
                        doc.addPage();
                        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                        heightLeft -= pageHeight;
                    }
                    doc.save('ComprobanteVenta.pdf');
                });
            },
            crearPDF(){
                    var quotes = document.getElementById('factura');
                    html2canvas(quotes).then(function (canvas) {
                    var imgData = canvas.toDataURL('image/png');
                    var imgWidth = 210;
                    var pageHeight = 295;
                    
                    var imgHeight = canvas.height * imgWidth / canvas.width;
                    var heightLeft = imgHeight;

                    var doc = new jsPDF('p', 'mm', 'a4');
                    var position = 0;

                    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;

                    while (heightLeft >= 0) {
                        position = heightLeft - imgHeight
                        doc.addPage()
                        doc.addImage(imgData, 'PNG',0, position, imgWidth, imgHeight)
                        heightLeft -= pageHeight
                    }
                    doc.save('ComprobanteVenta.pdf')
                })

            },
            mostrarComprobante(item){
                this.limpiar()
                this.tipo_comprobante = item.tipo_comprobante
                this.serie_comprobante = item.serie_comprobante
                this.num_comprobante = item.num_comprobante
                this.fecha = item.createdAt
                this.persona = item.persona
                this.impuesto = item.impuesto
                this.listarDetalles(item._id)

                this.comprobanteModal = 1
            },
            ocultarComprobante(item){
                this.comprobanteModal = 0
            },
            selectPersona(){
                let me = this
                let personaArray = []
                let header={"Token": this.$store.state.token}
                let configuracion = {headers: header}
                axios.get('persona/listClientes', configuracion).then(function(response){
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
                            precio:data.precio_venta,
                            descuento:0
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
                axios.get('venta/list', configuracion).then(function(response){
                    //console.log(response)
                    me.ventas = response.data
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
            listarDetalles(id){
                //console.log('listar detalles' +id)
                let me = this
                let header={"Token": this.$store.state.token}
                let configuracion = {headers: header}
                axios.get('venta/query?_id='+id, configuracion).then(function(response){
                    console.log(response.data.detalles)
                    //me.articulos = response.data.detalles
                    me.detalles = response.data.detalles
                }).catch(function(error){
                    console.log(error)
                })
            },
            verVenta(item){
                this.limpiar()
                this.tipo_comprobante = item.tipo_comprobante
                this.serie_comprobante = item.serie_comprobante
                this.num_comprobante = item.num_comprobante
                this.persona = item.persona._id
                this.impuesto = item.impuesto
                this.listarDetalles(item._id)
                this.verNuevo = 1
                this.verDetalle = 1
            },
            mostrarModalArticulos(){
                this.dialog = 1
            },
            validar(){
                this.valida = 0
                this.validaMensaje = []
                if(!this.persona){
                    this.validaMensaje.push('Seleccione un cliente.')
                }
                if(!this.tipo_comprobante){
                    this.validaMensaje.push('Seleccione un tipo de comprobante')
                }
                /* if(this.descripcion.length > 255){
                    this.validaMensaje.push('La descripcion no deve tener mas de 255 caracteres')
                } */
                if(!this.num_comprobante){
                    this.validaMensaje.push('Ingrese el número de comprobante')
                }
                if(!this.impuesto || this.impuesto < 0 || this.impuesto > 1){
                    this.validaMensaje.push('Ingrese un impuesto válido')
                }
                if(this.detalles.length <= 0){
                    this.validaMensaje.push('Ingrese al menos un artículo al detalle')
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
                this.limpiar()
            },
            guardar(){
                let me = this
                let header={"Token": this.$store.state.token}
                let configuracion = {headers: header}

                if(this.validar()){
                    return
                }

                axios.post('venta/add', {
                    'persona':this.persona,
                    'usuario':this.$store.state.usuario._id,
                    'tipo_comprobante':this.tipo_comprobante,
                    'serie_comprobante':this.serie_comprobante,
                    'num_comprobante':this.num_comprobante,
                    'impuesto':this.impuesto,
                    'total':this.total,
                    'detalles':this.detalles,
                }, configuracion)
                .then(function(response){
                    me.limpiar()
                    me.close()
                    me.listar()
                })
                .catch(function(){
                    console.log(error.response)
                })
                
            },
            limpiar(){
                this._id = ''
                this.tipo_comprobante = ''
                this.serie_comprobante = ''
                this.num_comprobante = ''
                this.impuesto = 0
                this.codigo = ''
                this.total = 0
                this.totalParcial = 0
                this.totalImpuesto = 0
                this.detalles = []
                this.verNuevo = 0
                this.valida = 0
                this.validaMensaje = []
                this.verDetalle = 0
                
            },
            activarDesactivarMostrar(action, item){
                this.adModal = 1
                this.adNombre = item.num_comprobante
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
                axios.patch('venta/activate',{'_id':this.adId})
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
                axios.patch('venta/deactivate',{'_id':this.adId})
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

<style>
	    #factura {
            padding: 20px;
            font-family: Arial, sans-serif;
            font-size: 16px ;
        }

        #logo {
            float: left;
            margin-left: 2%;
            margin-right: 2%;
        }
        #imagen {
            width: 100px;
        }

        #fact {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
        }   

        #datos {
            float: left;
            margin-top: 0%;
            margin-left: 2%;
            margin-right: 2%;
            /*text-align: justify;*/
        }

        #encabezado {
            text-align: center;
            margin-left: 10px;
            margin-right: 10px;
            font-size: 16px;
        }

        section {
            clear: left;
        }

        #cliente {
            text-align: left;
        }

        #facliente {
            width: 40%;
            border-collapse: collapse;
            border-spacing: 0;
            margin-bottom: 15px;
        }

        #fa {
            color: #FFFFFF;
            font-size: 14px;
        }

        #facarticulo {
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
            padding: 20px;
            margin-bottom: 15px;
        }

        #facarticulo thead {
            padding: 20px;
            background: #2183E3;
            text-align: center;
            border-bottom: 1px solid #FFFFFF;
        }

        #gracias {
            text-align: center;
        }
    </style>