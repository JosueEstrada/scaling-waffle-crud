sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
], (Controller, MessageToast, MessageBox) => {
    "use strict";

    return Controller.extend("appdemo.test.controller.Main", {
        onInit() {
            this.localModel = this.getOwnerComponent().getModel("localModel");

            this.localModel.setSizeLimit(999999);

            let miLista = this.localModel.getProperty("/listado");
            console.log(miLista);
            miLista[0].unidades = "Libras";
            console.log(miLista);

            //this.localModel.setProperty("/listado", []);
        },

        onSave: function () {
            let material = this.localModel.getProperty("/formMate");
            let descripcion = this.localModel.getProperty("/formDesc");
            let cantidad = this.localModel.getProperty("/formCant");
            let peso = this.localModel.getProperty("/formPeso");
            let unidadesKey = this.localModel.getProperty("/formUnid");
            let unidades = this.byId("unidades").getSelectedItem().getText();

            //console.log(peso, unidadesKey, unidades);
            // Crear un objeto con los datos del formulario capturado
            let miFormulario = {
                material: material,
                descripcion: descripcion,
                cantidad: cantidad,
                peso: peso,
                unidadesKey: unidadesKey,
                unidades: unidades
            };

            if (this.path) {
                this.localModel.setProperty(this.path + "/material", material);
                this.localModel.setProperty(this.path + "/descripcion", descripcion);
                this.localModel.setProperty(this.path + "/cantidad", cantidad);
                this.localModel.setProperty(this.path + "/peso", peso);
                this.localModel.setProperty(this.path + "/unidades", unidades);

                this.path = null;
                MessageToast.show("Registro modificado");
            } else {


                // Instanciar el modelo
                let miLista = this.localModel.getProperty("/listado");

                // Agregar el formulario a modelo
                miLista.push(miFormulario);

                MessageToast.show("Registro agregado");
                this.localModel.setProperty("/listado", miLista);
            }

            // Limpiar el formulario
            this.localModel.setProperty("/formMate", "");
            this.localModel.setProperty("/formDesc", "");
            this.localModel.setProperty("/formCant", "");
            this.localModel.setProperty("/formPeso", "");
            this.localModel.setProperty("/formUnid", "");

            this.localModel.setProperty("/isEditing", false);

            this.localModel.refresh();
        },

        onEdit: function (oEvent) {
            let oContext = oEvent.getSource().getBindingContext("localModel");
            let oSelectedItem = oContext.getObject();

            this.localModel.setProperty("/formMate", oSelectedItem.material);
            this.localModel.setProperty("/formDesc", oSelectedItem.descripcion);
            this.localModel.setProperty("/formCant", oSelectedItem.cantidad);
            this.localModel.setProperty("/formPeso", oSelectedItem.peso);
            this.localModel.setProperty("/formUnid", oSelectedItem.unidades);

            // Activar el modo edicion
            this.localModel.setProperty("/isEditing", true);
            this.path = oContext.getPath();

        },

        onDelete: function (oEvent) {
            let oContext = oEvent.getSource().getBindingContext("localModel");
            let path = oContext.getPath();
            let miLista = this.localModel.getProperty("/listado");
            let oModel = this.localModel;
            MessageBox.warning("¿Eliminar registro?", {
                title: "Confirmación",
                icon: MessageBox.Icon.WARNING,
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        let index = parseInt(path.split("/")[2], 10);
                        console.log("path: ", path);
                        miLista.splice(index, 1);
                        // Scope? 
                        //this.localModel.refresh();
                        //this.localModel.setProperty("/listado", miLista);
                        oModel.setProperty("/listado", miLista);
                        oModel.refresh();
                        MessageToast.show("Registro eliminado");
                    }
                }
            });
        },

        onCancel: function () {

            this.localModel.setProperty("/formMate", "");
            this.localModel.setProperty("/formDesc", "");
            this.localModel.setProperty("/formCant", "");
            this.localModel.setProperty("/formPeso", "");
            this.localModel.setProperty("/formUnid", "");

            this.localModel.setProperty("/isEditing", false);

            this.path = null;
        }


    });
});