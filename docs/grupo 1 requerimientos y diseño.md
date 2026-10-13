|Proyecto:|Sistema SNAI para<br>Integral (UZDI)|el manejo de las U|nidades Zonales de Desarrollo|
|---|---|---|---|
|Nombre:|Sprint 2|||
|Objetivo:|Diseñar un sistema d|e información para se|r utilizado por las UZDIs|
|№:|3|Fecha:|18/06/2026|
|Hora:|16:32 - 23:30|Acta №:|1|
|Equipo||||
|Nombre|Rol|Institución|Firma|
|Francisco Miguez|Product Owner|PUCE|Francisco Miguez|
|Luis Alobuela|Scrum master|PUCE|Luis Alobuela|
|James Arguello|Scrum Team|PUCE|James Arguello|
|Carlos Galarza|Scrum Team|PUCE|Carlos Galarza|
|Joan Castro|Scrum Team|PUCE|Joan Castro|



# **1. Requerimientos** 

### **<u>Glosario</u>** 

|**Término**|**Definición**|
|---|---|
|**Gestión**|Se refiere a todo el conjunto (o parte) de las<br>operaciones CRUD|
|**Administrador**|Rol administrador asociado al sistema|
|**Usuario**|Conjunto de todos los roles que conformarán al<br>sistema de información|
|**Obtención**|Se refiere a la operación GET (consulta) de un<br>conjunto CRUD|



## **Definición de funcionalidades principales** 

|**ID**<br>RF-01|**Descripción**<br>Ingreso a gestión de usuarios|
|---|---|
|RF-02|Ingreso a gestión de adolescentes|
|RF-03|Ingreso a gestión de expedientes|
|RF-04|Ingreso a gestión de GDOs|
|RF-05|Ingreso a gestión de medidas|
|RF-06|Ingreso a gestión de fichas|
|RF-07|Ingreso a gestión de representantes / familiares|
|RF-08|Ingreso a gestión de contexto familiar|
|RF-09|Obtención de cantones|
|RF-10|Ingreso a gestión de permisos|
|RF-11|Obtención de UZDIs|
|RF-12|Ingreso a gestión de perfiles / roles|
|RF-13|Ingreso a gestión de vínculos (adolescente representante)|
|RF-14|Ingreso a gestión de talleres|
|RF-15|Ingreso a gestión de asistencia de participantes al taller|
|RF-16|Generación de reportes estadísticos|
|RF-17|Obtención de provincias|
|RF-18|Obtención de nacionalidad|
|RF-19|Obtención de estado civil|
|RF-20|Obtención de etnia|
|RF-21|Ingreso al sistema|



### **Descripción del sistema** 

El sistema de información para las UZDIs, diseñado en el presente documento, es una herramienta informática que permitirá gestionar de manera eficiente y centralizada la información institucional. Este sistema facilitará el control, registro y seguimiento de documentos ingresados, expedientes de adolescentes, vínculos familiares y demás información relevante, proporcionando un manejo ágil, seguro y organizado para todos los integrantes de las UZDIs. 

### **Involucrados:** 

Algunas de las personas involucradas en el desarrollo de este sistema de información para las UZDIs son: 

- Equipo de desarrollo 

- Directora de la UZDI 

- Equipo técnico de la UZDI 

### **Administración del sistema** 

### **Propuesta de roles:** 

De acuerdo con los requerimientos proporcionados por la Directora de la UZDI durante la fase de Análisis de Requerimientos, se identifican diversos perfiles de usuario que interactuarán con el sistema de información. Estos roles estarán definidos en función de las responsabilidades y competencias de cada eje de atención, permitiendo un acceso controlado a la información según las funciones desempeñadas. 

Inicialmente, se proponen los siguientes roles: 

- Administrador 

- Psicólogo 

- Trabajador Social 

- Coordinador de área 

- Educador 

- Jurídico 

- Superadministrador 

### **Descripción de roles del sistema** 

**Superadministrador:** Usuario con el nivel más alto de control dentro del sistema, supervisa la configuración general, consulta información institucional y revisa aspectos globales relacionados con usuarios, permisos y reportes. 

**Administrador:** Usuario encargado de la administración operativa del sistema, gestiona usuarios, perfiles, permisos y datos de apoyo necesarios para el funcionamiento de los módulos, sin intervenir directamente en información técnica sensible que no corresponda a su función. 

**Coordinador de Área:** Usuario responsable de supervisar el trabajo del equipo técnico de la UZDI, consulta información consolidada, revisa reportes, da seguimiento a casos asignados y verifica el avance de los procesos realizados por los distintos ejes de atención. 

**Trabajador Social:** Usuario encargado de registrar, revisar y actualizar información relacionada con adolescentes, contexto familiar, representantes, vínculos familiares y datos sociofamiliares requeridos para el seguimiento del caso. 

**Psicólogo:** Usuario encargado de registrar y consultar información psicológica del adolescente, así como datos relacionados con evaluaciones, informes o seguimientos correspondientes al eje psicológico. 

**Educador:** Usuario encargado de registrar información educativa, talleres, asistencia y actividades formativas relacionadas con los adolescentes y participantes vinculados a los procesos socioeducativos. 

**Jurídico:** Usuario encargado de gestionar información legal asociada al adolescente, expedientes, medidas socioeducativas, infracciones, documentos habilitantes y estado jurídico del proceso. 

**Usuario:** Término general utilizado para referirse a cualquier persona autorizada que interactúa con el sistema según el perfil, rol y permisos asignados. 

# **2. Actividades** 

### **Diagrama de contexto** 



<!-- Start of picture text -->
Super administrador Super Administrador<br>Administrador ‘Administrador<br>Usuarios Usuarios<br>Educador<br>Sistema SNAI para el<br>Manejo de las Unidades<br>Zonales de Desarolo<br>‘Trabajador Social Registrar cha sociofamiar Integral (W200 Ficha consotidada det adclescente Trabajador Social<br>Psicbogo Psicélogo<br>Coordinadorde Area Coordinador de Area<br><!-- End of picture text -->

**Diagrama de Nivel 0** 



<!-- Start of picture text -->
= SF<br>xa _ SE ===] eee<br>Secon [=| Py SS<br>a ra<br>a 5 a<br>oa“ (kh!) all — [rene |<br>oS as ="—<br><!-- End of picture text -->

### **Diagramas de casos de uso** 

#### **Diagramas de casos de uso generales** 



<!-- Start of picture text -->
Sistema UZDI<br>© Gestion de permisos ><br>— RF-Ol<br> Gestiénde usuarios ><br>CD GestionOo<br>Aaministrador de acciones ><br>Gestion, ORF-A2de perfiles /roles ><br>~~ RF-21 5<br>Ingreso<br>al sistema ><br>a RF-O2<br>Gestion<br>de adolescentes<br>C ~RF-20 .<br><< obtencién<br>de etnia ><br>a RAS<br> obtencin de estado civil ><br>a RF-IB<br>© obtencién de nacionalidad ><br>—RE-AZ<br>S Obtenciénde provincias<br>i} ~ RF-16<br>(Generacién de reportes))<br>vlestadisticos<br>(Gestién de asistencia)<br>waltaller<br>|<br>a aaa<br>Gestion<br>oO<br>CO de talleres ><br>Usuario «< (adolescenteGestién de-representante) vinculos »<br>\\<br>> RFD<br>_ Obtencién de uzDIs_><br>)<br>~~ RF-09<br>‘T optencisn<br>| pbtencién) d e\e can tonestones ><br>~~ RF-OB<br>‘Gestion de contexto familiar ><br>——RE-OF<br>CGestion de representantes /)<br>°° familiares<br>—<br>c RF-06<br>CGestién de fichas ><br>—_RF-OS<br> Gestién de medidas ><br>~ RF-04 >)<br>Gestién de GDOs ><br>———RF-03<br>T Gestién<br>de expedientes ><br><!-- End of picture text -->

**Diagramas de casos de uso de siguiente nivel** 

_RF21. Ingreso al sistema_ 



<!-- Start of picture text -->
RF-21<br>Ingreso al sistema<br>Usuarios<br><!-- End of picture text -->

_RF10. Ingreso a gestión de permisos_ 



<!-- Start of picture text -->
Sistema<br>-<br>Gestién de permisos /<br>Administrador —_ a<br><!-- End of picture text -->

_RF01. Ingreso a gestión de usuarios_ 



<!-- Start of picture text -->
Administrador<br>Sistel<br>a RF11 ™ a RFO1 ~<br>Obtencién de UZDis_ —___\_ Gesti6n de usuarios _/<br><!-- End of picture text -->



<!-- Start of picture text -->
RF02. Ingreso a gestión de adolescentes<br>Trabajador Social<br>Sistema<br>- FIG . 7 ~-RFO2 ; RFO4<br>Generacién de informes_»————_ Gestién de adolescentes_———~._ Gestin de GDOs<br><!-- End of picture text -->



<!-- Start of picture text -->
RF03. Ingreso a gestión de expedientes<br>Sistema<br>-<br>+} ;\ Gestion~ deRFOSexpedientes_»————~__Gestién~deRFO2adolescentes<br>Juridico OO OO<br><!-- End of picture text -->

_RF04. Ingreso a gestión de GDOs_ 



<!-- Start of picture text -->
Trabajador Social<br>Sistem.<br>- RFO2 ~ y RFO4 .<br>Gestion de adolescentes_ ~~ Gestiénde GDOs_/<br><!-- End of picture text -->

_RF05. Ingreso a gestión de medidas_ 



<!-- Start of picture text -->
Sistema<br>:<br>i vo\_GestiénRFOSde medidas _/<br>Usuario _ _<br><!-- End of picture text -->

_RF16. Generación de reportes_ 



<!-- Start of picture text -->
Sistema<br>_<br>+ vo RFIG ——RFO2<br>A Generacién de informes _»———_ Gesti6n de adolescentes _<br>Usuarios _ a _ a<br><!-- End of picture text -->

_RF11. Obtención de UZDIs_ 



<!-- Start of picture text -->
Sistema<br>.<br>t RFID vo RFOL<br>Obtencién de UZDIs_ ~~ Gestién de usuarios _<br>Administrador OO OO<br><!-- End of picture text -->

### **Diagramas de casos de uso detallados** 

### **Ingreso al sistema** 

|**Nombre del caso de uso:**|Ingreso al sistema|
|---|---|
|**Área:**|Acceso y seguridad del sistema|
|**ID Único:**|RF21|
|**Actor(es):**|Todos los usuarios|
|**Interesados:**|Super Administrador, Administrador, Educador, Trabajador Social, Psicólogo,<br>Jurídico y personal autorizado de la UZDI|
|**Descripción:**|Permite que los usuarios autorizados ingresen al sistema mediante credenciales de<br>acceso.|
|**Evento desencadenador:**|El usuario accede al sistema para realizar actividades administrativas, técnicas,<br>jurídicas o de seguimiento dentro de la UZDI.|
|**Tipo de desencadenador:**|Externo|



|**Pasos realizados**|**Información para los pasos**|
|---|---|
|1. El sistema muestra la pantalla de ingreso con formulario.||
|2. El usuario ingresa sus credenciales de acceso.|Credenciales de ingreso asociado al<br>usuario|
|3. El usuario selecciona la opción de ingresar.||



|**Precondiciones:**|El usuario debe estar previamente registrado en el sistema mediante la gestión de<br>usuarios.|
|---|---|
|**Postcondiciones:**|El usuario ingresa correctamente al sistema.|
|**Suposiciones:**|El sistema se encuentra funcionando correctamente y la información a usar está<br>registrada.|



|**Garantía de éxito:**|El usuario accede correctamente al sistema.|
|---|---|
|**Garantía mínima:**|Si las credenciales son incorrectas o el usuario no se encuentra registrado, el<br>sistema no permite el ingreso.|
|**Requerimientos**<br>**cumplidos:**|Ingreso al sistema. Se apoya en Gestión de usuarios.|
|**Cuestiones pendientes:**|¿El sistema bloqueará temporalmente el acceso después de varios intentos fallidos?<br>¿Se incluirá recuperación de contraseña desde la sistema?|
|**Prioridad:**|Alta|
|**Riesgo:**|Alta|



#### **Ingreso a gestión de permisos** 

|**Nombre del caso de uso:**|Ingreso a gestión de permisos|
|---|---|
|**Área:**|Seguridad y administración del sistema|
|**ID Único:**|RF10|
|**Actor(es):**|Administrador|
|**Interesados:**|Super Administrador, Administrador, usuarios del sistema y director de la UZDI|
|**Descripción:**|Permite al administrador ingresar al módulo de permisos del sistema para el<br>acceso a las funcionalidades disponibles según los perfiles o roles definidos.|
|**Evento**<br>**desencadenador:**|El administrador ha ingresado correctamente al sistema, accede al menú de<br>administración y selecciona la opción de gestión de permisos para revisar o<br>administrar los permisos asociados a los perfiles del sistema.|
|**Tipo**<br>**de**<br>**desencadenador:**|Externo|



|**Pasos realizados**||**Información para los pasos**|
|---|---|---|
|1. El sistema presenta los p|erfiles o roles registrados.||
|2. El administrador selecc<br>permisos.|iona un perfil o rol para revisar sus||
|3. El sistema presenta las ac|ciones o funcionalidades disponibles.||
|4. El sistema muestra los pe|rmisos asociados al perfil seleccionado.||
|5. El administrador revisa l|os permisos asignados al perfil.||
|6. Si requiere ajustar per<br>acciones permitidas o restri|misos, el administrador selecciona las<br>ngidas.|Perfiles, roles, acciones del sistema|
|7. El sistema guarda la conf|iguración de permisos.||
|**Precondiciones:**|El administrador debe haber ingresad<br>contar con autorización.|o correctamente al sistema y debe|
|**Postcondiciones:**|El administrador accede al módulo de g|estión de permisos.|
|**Suposiciones:**|El sistema se encuentra funcionando cor|rectamente.|
|**Garantía de éxito:**|El sistema permite el acceso al módulo|de permisos.|
|**Garantía mínima:**|Si el administrador no cuenta con autoriz<br>al módulo.|ación, el sistema restringe el acceso|
|**Requerimientos**<br>**cumplidos:**|Gestión de permisos. Se apoya en Gesti<br>al sistema.|ón de perfiles / roles junto a Ingreso|
|**Cuestiones pendientes:**|¿Todos los administradores podrán acce<br>determinados perfiles administrativos?|der a la gestión de permisos o solo|
|**Prioridad:**|Alta||
|**Riesgo:**|Alta||



#### **Ingreso a gestión de usuarios** 

|**Nombre del caso de**<br>**uso:**|Ingreso a gestión de usuarios|
|---|---|
|**Área:**|Seguridad y administración del sistema|
|**ID Único:**|RF01|
|**Actor(es):**|Administrador|
|**Interesados:**|Super Administrador, Administrador, usuarios del sistema y responsables<br>administrativos de la UZDI|
|**Descripción:**|Permite al administrador ingresar al módulo de gestión de usuarios para<br>visualizar y administrar la información de las personas autorizadas a utilizar el<br>sistema.|
|**Evento**<br>**desencadenador:**|El administrador ha ingresado correctamente al sistema, accede al menú de<br>administración y selecciona la opción de gestión de usuarios para administrar<br>la información de las personas autorizadas a utilizar el sistema.|
|**Tipo**<br>**de**<br>**desencadenador:**|Externo|



|**Pasos realizados**|**Información para los pasos**|
|---|---|
|1. El sistema presenta el listado o buscador de usuarios<br>registrados.||
|2. El administrador revisa la información de los usuarios<br>disponibles.||
|3. Si requiere registrar un nuevo usuario, el administrador<br>selecciona la opción correspondiente.||
|4. El sistema presenta el formulario de registro de usuario.||
|5. El administrador ingresa los datos del usuario.|Datos del usuario|



|6. El sistema guarda la|información del usuario.|
|---|---|
|7. Si requiere corr<br>selecciona un usuario r|egir información, el administrador<br>egistrado.|
|8. El administrador cor|rige la información correspondiente.<br>Datos corregidos del usuario|
|9. El sistema verifica y|guarda los datos corregidos.|
|**Precondiciones:**|El administrador debe haber ingresado correctamente al sistema y debe contar<br>con permisos para acceder al módulo de gestión de usuarios, deben existir<br>UZDIs registradas para asociar o identificar la unidad correspondiente del<br>usuario.|
|**Postcondiciones:**|El administrador accede correctamente al módulo de gestión de usuarios.|
|**Suposiciones:**|El sistema se encuentra funcionando correctamente y la información está<br>registrada.|
|**Garantía de éxito:**|El sistema permite el acceso al módulo de usuarios.|
|**Garantía mínima:**|Si el administrador no posee autorización el sistema restringe el acceso.|
|**Requerimientos**<br>**cumplidos:**|Gestión de usuarios. Se apoya en Obtención de UZDIs, Gestión de permisos<br>y Ingreso al sistema.|
|**Cuestiones**<br>**pendientes:**|¿Todos los administradores podrán acceder a la gestión de usuarios o sólo<br>determinados perfiles? ¿La asociación de un usuario a una UZDI será<br>obligatoria para todos los perfiles?|
|**Prioridad:**|Alta|
|**Riesgo:**|Alta|



#### **Ingreso a gestión de adolescentes** 

|**Nombre del caso de**<br>**uso:**|Ingreso a gestión de adolescentes|
|---|---|
|**Área:**|Gestión socioeducativa y registro de adolescentes|
|**ID Único:**|RF02|
|**Actor(es):**|Trabajador Social|
|**Interesados:**|Trabajador Social, equipo técnico de la UZDI, área jurídica, administración<br>de la UZDI y SNAI|
|**Descripción:**|Permite al Trabajador Social ingresar al módulo de adolescentes para<br>gestionar la información general de los adolescentes vinculados a la UZDI.|
|**Evento**<br>**desencadenador:**|El Trabajador Social ha ingresado correctamente al sistema, accede al menú<br>correspondiente y selecciona la opción de gestión de adolescentes para revisar,<br>registrar o administrar la información de los adolescentes vinculados a la<br>UZDI.|
|**Tipo**<br>**de**<br>**desencadenador:**|Externo|



|**Pasos realizados**<br>**Información para los pasos**|
|---|
|1. El sistema presenta el listado o buscador de<br>adolescentes registrados.|
|2. El Trabajador Social revisa los adolescentes ingresados<br>en el sistema.|
|3. El Trabajador Social selecciona un adolescente para<br>revisar su información.|
|4. El sistema presenta los datos registrados del<br>adolescente.|
|5. Si el adolescente no se encuentra registrado, el<br>Trabajador Social selecciona la opción de nuevo<br>adolescente.|



|6. El sistema presenta el formulario de registro de<br>adolescentes.||
|---|---|
|7. El Trabajador Social ingresa los datos del adolescente.|Datos del adolescente|
|8. El sistema guarda la información del adolescente||
|9. Si requiere corregir información, el Trabajador Social<br>selecciona la opción de editar a un adolescente registrado.||
|10. El sistema presenta los datos actuales del adolescente.||
|11. El Trabajador Social corrige la información<br>correspondiente.|Datos corregidos del adolescente|
|12. El sistema verifica y guarda los datos corregidos.||
|13. Si se requiere eliminar o retirar un registro, el<br>Trabajador Social selecciona la opción para eliminar al<br>adolescente correspondiente.||
|14. El Trabajador social confirma la acción.||



|**Precondiciones:**|El Trabajador Social debe haber ingresado correctamente al sistema y contar<br>con permisos para acceder al módulo de gestión de adolescentes.|
|---|---|
|**Postcondiciones:**|El Trabajador Social accede correctamente al módulo de adolescentes.|
|**Suposiciones:**|El sistema se encuentra funcionando correctamente y la información de<br>adolescentes, permisos y catálogos de apoyo está registrado.|
|**Garantía de éxito:**|El sistema permite el acceso al módulo de adolescentes.|
|**Garantía mínima:**|Si el usuario no posee autorización el sistema restringe el acceso o muestra<br>un mensaje informativo sin modificar los datos registrados.|
|**Requerimientos**<br>**cumplidos:**|Gestión de adolescentes. Se apoya en Gestión de GDOs, Obtención de<br>cantones, Obtención de provincias, Obtención de nacionalidad, Obtención de<br>estado civil y Obtención de etnia.|
|**Cuestiones**<br>**pendientes:**|¿El Trabajador Social podrá visualizar adolescentes de todas las UZDIs o<br>únicamente los asociados a su unidad? ¿La información sensible del<br>adolescente tendrá restricciones según el perfil del usuario?|
|**Prioridad:**|Alta|
|**Riesgo:**|Alta|



#### **Ingreso a gestión de expedientes** 

|**Nombre del caso de**<br>**uso:**|**Ingreso a gestión de expedientes**|
|---|---|
|**Área:**|Gestión jurídica y seguimiento socioeducativo|
|**ID Único:**|RF03|
|**Actor(es):**|Jurídico|
|**Interesados:**|Jurídico, equipo técnico de la UZDI, Administrador, SNAI y adolescentes<br>vinculados a medidas socioeducativas|
|**Descripción:**|Permite al actor Jurídico ingresar al módulo de expedientes para visualizar y<br>gestionar la información legal y socioeducativa asociada a un adolescente.|
|**Evento**<br>**desencadenador:**|El actor Jurídico ha ingresado correctamente al sistema, accede al menú<br>correspondiente y selecciona la opción de gestión de expedientes para revisar,<br>registrar o administrar la información legal y socioeducativa asociada a un<br>adolescente.|
|**Tipo**<br>**de**<br>**desencadenador:**|Externo|



|**Pasos realizados**|**Información para los pasos**|
|---|---|
|1. El sistema presenta el listado o buscador de expedientes<br>registrados.||
|2. El actor Jurídico selecciona un expediente para revisar su<br>información.||
|3. El sistema presenta la información registrada del expediente.||
|4. Si se requiere registrar un nuevo expediente, el actor Jurídico<br>selecciona la opción correspondiente.||
|5. El sistema presenta el formulario de registro de expediente.||
|6. El actor Jurídico ingresa la información del expediente.|Datos para el expediente|



|7. El sistema guarda la<br>8. Si requiere corregir<br>opción correspondiente|información del expediente.<br>información, el actor Jurídico selecciona la<br>de acuerdo al expediente registrado.|
|---|---|
|9. El sistema presenta l|os datos actuales del expediente.|
|10. El actor Jurídico co|rrige la información correspondiente.<br>Datos corregidos del expediente|
|11. El sistema verifica|y guarda los datos corregidos.|
|**Precondiciones:**|El actor Jurídico debe haber ingresado correctamente al sistema y contar con<br>permisos para acceder al módulo de gestión de expedientes.|
|**Postcondiciones:**|El actor Jurídico accede correctamente al módulo de expedientes.|
|**Suposiciones:**|El sistema se encuentra funcionando correctamente y la información de<br>adolescentes, expedientes, medidas, infracciones y UZDIs está registrada.|
|**Garantía de éxito:**|El sistema permite el acceso al módulo de expedientes.|
|**Garantía mínima:**|Si el usuario no posee autorización el sistema restringe el acceso.|
|**Requerimientos**<br>**cumplidos:**|Gestión de expedientes. Se apoya en Gestión de adolescentes y utiliza<br>información relacionada con medidas socioeducativas, infracciones y UZDIs<br>como datos complementarios del expediente.|
|**Cuestiones**<br>**pendientes:**|¿El actor Jurídico podrá visualizar expedientes de todas las UZDIs o<br>únicamente los correspondientes a su unidad? ¿Se permitirá consultar<br>expedientes cerrados o solo expedientes activos?|
|**Prioridad:**<br>**Riesgo:**|Alta<br>Alta|



#### **Ingreso a gestión de GDOs** 

|**Nombre del caso de**<br>**uso:**|**Ingreso a gestión de GDOs**|
|---|---|
|**Área:**|Gestión socioeducativa y datos de apoyo del adolescente|
|**ID Único:**|RF04|
|**Actor(es):**|Administrador|
|**Interesados:**|Trabajador Social, equipo técnico de la UZDI, Jurídico, Administrador y<br>SNAI|
|**Descripción:**|Permite al Trabajador Social ingresar al módulo de Gestión de GDOs para<br>visualizar la información registrada sobre grupos de delincuencia organizada<br>que puede estar asociada a un adolescente.|
|**Evento**<br>**desencadenador:**|El administrador ha ingresado correctamente al sistema, accede al menú<br>correspondiente y selecciona la opción de gestión de GDOs para revisar o<br>administrar la información de grupos de delincuencia organizada que puede<br>ser utilizada como dato de apoyo en la gestión de adolescentes.|
|**Tipo**<br>**de**<br>**desencadenador:**|Externo|



|**Pasos realizados**|**Información para los pasos**|
|---|---|
|1. El sistema presenta el listado o buscador de GDOs registrados.||
|2. El administrador revisa la información de los GDOs disponibles.||
|3. Si requiere registrar un nuevo GDO, el administrador selecciona la<br>opción correspondiente.||
|4. El sistema presenta el formulario de registro de GDO.||
|5. El administrador ingresa la información del GDO.|Datos de GDO|
|6, El sistema guarda la información del GDO.||



|7. Si requiere corregi<br>opción correspondient|r información, el administrador selecciona la<br>e para modificar un GDO registrado.|
|---|---|
|8. El sistema presenta|los datos actuales del GDO.|
|9. El administrador cor|rige la información correspondiente.<br>Datos de GDO corregidos|
|10. El sistema verifica|y guarda los datos corregidos.|
|**Precondiciones:**|El Administrador debe haber ingresado correctamente al sistema y contar con<br>permisos para acceder al módulo de gestión de GDOs.|
|**Postcondiciones:**|El Administrador accede correctamente al módulo de GDOs.|
|**Suposiciones:**|El sistema se encuentra funcionando correctamente y la información de<br>usuarios, permisos, adolescentes y GDOs está registrada.|
|**Garantía de éxito:**|El sistema permite el acceso al módulo de GDOs.|
|**Garantía mínima:**|Si el usuario no posee autorización el sistema restringe el acceso.|
|**Requerimientos**<br>**cumplidos:**|Gestión de GDOs. Este requerimiento sirve como apoyo para Gestión de<br>adolescentes.|
|**Cuestiones**<br>**pendientes:**|¿La información de GDOs será visible para todos los perfiles técnicos o<br>únicamente para el Trabajador Social y perfiles autorizados? ¿La asociación<br>de un adolescente con un GDO será obligatoria u opcional?|
|**Prioridad:**|Media|
|**Riesgo:**|Medio|



#### **Ingreso a gestión de medidas** 

|**Nombre del caso de**<br>**uso:**|Ingreso a gestión de medidas|
|---|---|
|**Área:**|Gestión jurídica y seguimiento socioeducativo|
|**ID Único:**|RF05|
|**Actor(es):**|Usuario|
|**Interesados:**|Jurídico, Administrador, equipo técnico de la UZDI, SNAI y usuarios<br>autorizados del sistema|
|**Descripción:**|Permite al usuario autorizado ingresar al módulo de gestión de medidas<br>socioeducativas para visualizar la información relacionada con las medidas<br>registradas en el sistema.|
|**Evento**<br>**desencadenador:**|El usuario autorizado ha ingresado correctamente al sistema, accede al menú<br>correspondiente y selecciona la opción de gestión de medidas para revisar o<br>administrar las medidas socioeducativas que pueden asociarse a los expedientes.|
|**Tipo**<br>**de**<br>**desencadenador:**|Externo|



|**Pasos realizados**|**Información para los pasos**|
|---|---|
|1. El sistema presenta el listado o buscador de medidas socioeducativas<br>registradas.||
|2. El usuario revisa las medidas socioeducativas disponibles.||
|3. El usuario selecciona una medida para revisar su información.||
|4. El sistema presenta la información registrada de la medida.||
|5. Si se requiere registrar una nueva medida, el usuario selecciona la<br>opción correspondiente.||
|6. El sistema presenta el formulario de registro de medida.||
|7. El usuario ingresa la información de la medida socioeducativa.|Datos de medida|



|8. El sistema guarda la<br>|información de la medida.<br>||
|---|---|---|
|9. Si requiere corregi<br>correspondiente para m|r información, el usuario selecciona la opción<br>odificar una medida registrada.||
|10. El sistema presenta|los datos actuales de la medida.||
|12. El usuario corrige|la información correspondiente.|Datos de medida corregidos|
|13. El sistema verifica|y guarda los datos corregidos.||
|**Precondiciones:**|El usuario debe haber ingresado correctament<br>para acceder al módulo de gestión de medidas.|e al sistema y contar con permisos<br>|
|**Postcondiciones:**|El usuario accede correctamente al módulo de|gestión de medidas.|
|**Suposiciones:**|El sistema se encuentra funcionando correctam<br>permisos, medidas y expedientes está registrad|ente y la información de usuarios,<br>a.|
|**Garantía de éxito:**|El sistema permite el acceso al módulo de med|idas.|
|**Garantía mínima:**|Si el usuario no posee autorización el sistema r|estringe el acceso.|
|**Requerimientos**<br>**cumplidos:**|Gestión de medidas. Se apoya en Ingreso al s<br>información de medidas puede ser utilizada po|istema y Gestión de permisos. La<br>r Gestión de expedientes.|
|**Cuestiones**<br>**pendientes:**|¿Todos los usuarios autorizados podrán visu<br>jurídico y administrativo? ¿La duración de la m<br>podrá variar al asociarse a un expediente?|alizar las medidas o solo el perfil<br>edida será fija según el catálogo o|
|**Prioridad:**|Alta||
|**Riesgo:**|Alta||



#### **Generación de informes** 

|**Nombre del caso de**<br>**uso:**|Generación de informes|
|---|---|
|**Área:**|Reportes, informes y control estadístico|
|**ID Único:**|RF16|
|**Actor(es):**|Todos los usuarios|
|**Interesados:**|Super Administrador, Administrador, Educador, Trabajador Social, Psicólogo,<br>Jurídico, director de la UZDI y SNAI|
|**Descripción:**|Permite a los usuarios autorizados ingresar al módulo de generación de informes para<br>consultar información consolidada del sistema.|
|**Evento**<br>**desencadenador:**|El usuario autorizado ha ingresado correctamente al sistema, accede al menú<br>correspondiente y selecciona la opción de generación de informes para obtener<br>información consolidada de acuerdo con su perfil y necesidad de consulta.|
|**Tipo**<br>**de**<br>**desencadenador:**|Externo|



|**Pasos realizados**|**Información para los pasos**|
|---|---|
|1. El sistema presenta los tipos de informes disponibles.||
|2. El usuario selecciona el tipo de informe que requiere generar.||
|3. El sistema consulta la información registrada según el tipo de informe.||
|4. El sistema genera el informe solicitado.||
|5. El sistema presenta el resultado del informe al usuario.||



|**Precondiciones:**|El usuario debe haber ingresado correctamente al sistema y contar con<br>permisos para acceder al módulo de generación de informes.|
|---|---|
|**Postcondiciones:**|El usuario visualiza el informe generado de acuerdo con los criterios<br>seleccionados y los permisos asignados a su perfil.|
|**Suposiciones:**|El sistema se encuentra funcionando correctamente y la información de<br>adolescentes, expedientes, medidas, talleres, asistencia y contexto familiar<br>está registrada..|
|**Garantía de éxito:**|El sistema genera y presenta el informe solicitado con información<br>consolidada.|
|**Garantía mínima:**|Si el usuario no posee autorización, el sistema muestra un mensaje<br>informativo.|
|**Requerimientos**<br>**cumplidos:**|Generación de informes. Se apoya principalmente en Gestión de<br>adolescentes y puede utilizar información complementaria de expedientes,<br>medidas, talleres, asistencia y contexto familiar.|
|**Cuestiones**<br>**pendientes:**|¿Los informes podrán exportarse en PDF o Excel? ¿Cada perfil visualizará<br>todos los informes o solo los correspondientes a su área de trabajo?|
|**Prioridad:**|Alta|
|**Riesgo:**|Medio|



#### **Obtención de UZDIs** 

|**Nombre del caso de**<br>**uso:**|Obtención de UZDIs||
|---|---|---|
|**Área:**|Administración institucional y dat|os de apoyo|
|**ID Único:**|RF11||
|**Actor(es):**|Administrador||
|**Interesados:**|Administrador, Super Administra<br>las UZDIs y SNAI|dor, usuarios del sistema, responsables de|
|**Descripción:**|Permite al administrador obtener l<br>Desarrollo Integral registradas en|a información de las Unidades Zonales de<br>el sistema.|
|**Evento**<br>**desencadenador:**|El administrador ha ingresado corr<br>proceso que requiere información<br>generación de informes u otro<br>información por unidad zonal.|ectamente al sistema y se encuentra en un<br>de UZDIs, como la gestión de usuarios,<br>módulo que necesite asociar o filtrar|
|**Tipo**<br>**de**<br>**desencadenador:**|Externo||
|**Pasos realizados**||**Información para los pasos**|
|1. El sistema consulta las<br>institucional.|UZDIs registradas en la estructura||
|2. El sistema presenta<br>UZDIs.|la información principal de las||
|3. El administrador revis|a las UZDIs disponibles.||
|4. El administrador selec<br>lo requiere para validar i|ciona una UZDI cuando el proceso<br>nformación.||



|**Precondiciones:**|El administrador debe haber ingresado correctamente al sistema y contar con<br>permisos para consultar información institucional. Además, deben existir<br>UZDIs registradas en el sistema para que puedan ser presentadas.|
|---|---|
|**Postcondiciones:**|El administrador visualiza las UZDIs disponibles.|
|**Suposiciones:**|El sistema se encuentra funcionando correctamente y la información de<br>UZDIs está registrada.|
|**Garantía de éxito:**|El sistema muestra correctamente la información de UZDIs disponibles de<br>acuerdo a los permisos.|
|**Garantía mínima:**|Si el administrador no posee autorización el sistema muestra un mensaje<br>informativo.|
|**Requerimientos**<br>**cumplidos:**|Obtención de UZDIs. Sirve como apoyo para usuarios y otros procesos que<br>requieran asociar información a una UZDI.|
|**Cuestiones**<br>**pendientes:**|¿El administrador podrá visualizar todas las UZDIs o únicamente las<br>asociadas a su ámbito de gestión? ¿Las UZDIs se mostrarán solo como<br>catálogo de consulta o también como filtro dentro de los reportes?|
|**Prioridad:**|Media|
|**Riesgo:**|Medio|



### **Diagramas de secuencias** 

### **Ingreso al sistema** 



<!-- Start of picture text -->
Diagrama de Secuencia: Ingreso al Sistema<br>/ HO O OO<br>Usuario Interfaz de ingreso Controladorde acceso prsn :sesn<br>Acceder| Acceder alal sistemasistema |:<br>|g Mostrar pantalla de ingreso :<br>Mostrar pantalla de ngresg :<br>| Ingresar credenciales (usuario o correo, contrasefa) :<br>:<br>: Validar@ iniciar sesién :<br>: Yalidar e iniciar sesion Validar campos obligatorios, ::<br>': _ConsuiltarConsultar informacioninformacién registradaregistrada (seguridad.prsn)(seguridad prsn), |<br>| |g Datosde usuario obtenides :<br>' Verificar credenciales correspondientes :<br>: Identificar perfil o rol asociado (seguridad.prfl) |<br>' ‘4gPerfilorolidentificado<br>' Registrar inicio de sesién (seguridad.sesn) i<br>(seguridad.sesn)<br>:' Registrar inicio de sesién _| iy<br>‘eqGonfirmacionderegistro<br>H! -< HobiltarHabilitar accesoacceso seguinsegtin elel perfilperfil correspondientecorrespondiente | H!<br>|=eeEEeEeEEEeeeeeeMostrar panel principal del sistema |:<br><!-- End of picture text -->

### **Ingreso a gestión de permisos** 



<!-- Start of picture text -->
Diagrama de Secuencia: Ingreso a Gestién de Permisos<br>« ;<br>‘Administrador Interfaz de gestion ‘Controlador de permisos fl ‘acen rms<br>—— > rea rc ccf] A —___—_<br>Selena gestin de permisos<br>Solickar carga de pertlesregtrados<br>Consukar pers (segurdad.or)<br>|g Lstodo de perlesreisredos<br>Pasar perfes 0 oles registrados<br>Elsistema presenta os perfleso rte registrados<br>Revision<br>y Ajuste de Permisos<br>Seleccione un perl orl para revisar sus pemisos<br>Solickar datos  funcionaldades<br>del pert slecionado<br>{Ustad de acclones unctonaisades<br>|ConsutarpermisosConsuarpermisos actualesactuals d elel p e rlt (se Se gur idi ad  sms).pms)<br>Ug Lista de permisos sociados<br>= Eisistem presenta las accones 0 funconatidades dsponBes_{<br>Elsistema muestra los permisosasociados al perl selecionado<br>{Eladministrador evsa los permisosasignados a perf<br>a<br>[Lape at reaatee<br>aaa permed<br>NSERT/UPOATE/DELETE<br>| Gu ao rd ao r conf iguroigua ci oi n de pe rmisosrmisosINSERT/UPDATEIDELETE ee n seguridad p ms),ms)<br>“a Confimacion de guardade extozo<br>Confirmar actualizacion en la ntertaz<br>sj ftEl sistema  guaquo rd ao a con figurigur acin  dd e p ermisermisas__<br><!-- End of picture text -->



<!-- Start of picture text -->
Diagrama de Secuencia: Ingreso a Gestién de Usuarios<br>. 4 c<br>Administrador Interfaz de gesti6n Controladorde usuarios prsn<br>[Carga inicial del Médulo u<br>Selecciona gestién de usuarios ' '<br>_Solicitar| Solicitar lista liste  dede usuariosusuarios registrados registrados 5” CConsuttar informacién de personas autorizadas (seguridad prsn)<br>: | Gonsukar informacién de personas autorizades (seguridad.prsn), |<br>! |g Datos. de usuarios obtenidos<br>El 1|g PasarPoser listadolistado 00 buscadorbuscador dede usuariosvsverios ||<br><aElELsistemaadministradorsistema presentapresentarevisa olel istado istadola informacién©0 Buscadorbuscadorde los dedeusuarios usuarios registrados usuariosdisponibles registrados ||| :::<br>Flujo Opcional: Registrar Nuevo Usuario<br>[Tope 71st requiere registrar<br>Selecciona un nuevo usuario} T<br>; Seleccions il a opcién correspond ienteiente gt: :!<br>1g El sistema pp resenta el formulario de rere gistro de us uariouario _: :!<br>TnaresaIngresa loslos datosdatos deldel usuariousuali| Enviar informacién del nuevo usuario '!|<br>ne!<br>' Guardar informacién del usuario (INSERT en seguridad.prsn)<br>' |g Genfimacion de guardade extoro<br>Flujo Opcional: Corregir Informacion de Usuario<br>(opt7 1st requtere corregir nformaciont + +<br>SetecclonaSelecciona unun usuariousuario registraregistrado ____ iy,H ''<br>Lg Mos trartrar fo rmulariormulariocon con datos  aa ctual eses ' 'j<br>Corrige la informacién correspondiente ! :<br>| Enviar datos corregidos del usuario<br>i | Verificar datos corregidos<br>i:| Guardar cambios corregidos (UPDATE en seguridad.prsn)<br>'|g Gonfirmactén de actualizacion exitosa<br>El ‘ag|  ConfirmarConfirmar cambios cambios guardedes guardados _i<br>sa fl sistema vv eri if ca y  gugu arda los dato ss cor regidosregides__' :!<br><!-- End of picture text -->

**Ingreso a gestión de usuarios** 

### **Ingreso a gestión de adolescentes** 



<!-- Start of picture text -->
| Coneuttar adolescentes<br>: | Datos de adolescents obtenidos<br>|, Pasar Istado o buscador<br>{Lester£1 sistema presentapresenta etestado istado oo buscadorbuscador de de adolescentsadolescentes registradosresistrados1| £2s2"lstado 0 buscador dede adolescentes adolescentes_j:<br>Ei Trabojador Socal evs los adolescentesingresodos en el sistema<br>- Consulta de un Adolescente<br>revsarsuiformaciénSeleccona un adolescent para revisar<br>_Selecciona un adolescente par su informacién __,”: :<br>: || SolcitarSolctar  datos registradosdatos registrados deldel adotescenteseleccionado, adolescenteseleccionado  '<br>': _SonsulaeConsultar deralies detalles dede unun adslesceneeadolescente<br>Ingreso a gestión de expediente:  |g Resisro de aolescente encontrado<br>|g Pasar informacion detatada dl registro<br>El 1 £2:2" informacion detoliads del registro_<br>1 {L s isteste ma presen tata l oss datos registrados del ado lt escente __i :<br><!-- End of picture text -->



<!-- Start of picture text -->
i<br>Ingreso a gestión de GDOs :<br>i<br>El sistema verfica y guard los datos coregidos |:|.: ConfemarConfrmar comboscambios persstidespersstidos '<br><!-- End of picture text -->



<!-- Start of picture text -->
—[Fiujo Opcional: eliminaro Retirar un Registro<br>[ape7_SeleccionaflSelecciona£17st TrabojadorTrabojador se require lala social opsionopciénsocial atin confirma paraconfirmapara retvar on eiminareliminaleipaccnaccénalATal adolescenteadolescente correspondientecorrespondiente |:| Enviar orden de eliminaciénretcodefntiva :!<br>eliminacérirtco<br>Ener orden de definitive_rocesa aliminacino baja (DELETE / cambio de estado en BDD)<br>H _ Procesarelirinacén obaje (DELETE /cambio de estado en60D) _,<br>|g Confiemacién de accion completade<br>|g. Contemar remocin del registro j<br>a Confemar remacin del registro__<br><!-- End of picture text -->



<!-- Start of picture text -->
Diagrama de Secuencia: Gestién de Expedientes (Resumido)<br>Juridico Interfaz de gestién Controlador de expedientes expediente<br>1. Carga y Consulta (Pasos 1-3) -<br>| Selecc ionaiona gestiéngestion de  ee xpedi entesentes i:<br>Solcitar sta de expedientes '<br>_Solictar lista de expedientes :<br>_GonsutarConsultar expedientesexpedientes registradosregistrados (adolescente.expediente)(adolescente-erpediente) _'<br>“4g D2t0s de expesientes obtenidos f<br>Presenta “a MostrarMostar listadolistado o0 buseador buscador<br><a Presents el listadIstad o 0© buscador de  ee xpe cd ientes  registradosregistrados _<br>_SeleccionaSelecciona unun expedienteexpediente paraparorevisarsurevisar su informacioninformacién  _,- Solcitar datos del expediente seleccionado<br>_Solicitar datos del expediente seleccionado Buscar detalles del expediente<br>_Buscar detalles delexpediente<br>|g Revise encontrado<br>oe Mostordatos Mostrar datos<br><a Present a la i nfofo rma cioci n regis tradetrada de ll expediente _<br>2: Registro (Pasos 47)<br>[Tape7 Tat se requere registrar un nuevo expaalenta]<br>Selecciona la opcién correspondiente<br>_Selecciona Ia opcién correspondiente _,<br>-< Present sa el form ulariular o de registro de expediente _ :<br>Ingresa la informacién del expediente :<br>EnviarEnviar datosdatos ::<br>Guardar informacién (INSERT en adolescente-expediente) :<br>adolescente,expediente)<br>Guardar informacién (INSERT en _,<br>“a Gonfirmacién de guardade<br>Guarda sa ConfrmarConfirmar éxito éxito<br><= Suatda ll a informacién de ll expedie expedie nte __<br>3. Edicion (Pasos &-12)<br>[Tape71st requtere corregirIntarmacon)<br>_SeleccionaSelecciona laa opciénopcién correspondientecorrespondiente dede acuerdoacuerdo alal expediente,”expediente  Solctar datos vigentes para edicién<br>_Solicitar datos vigentes para edicién_” Consultar datos actuales<br>Gonsutar datos actuales<br>|g Dates recuperados<br>Mostrar datos actuales<br>Presenta los datos actuales del expediente «Mostrar datos actuales<br>corespondiente<br>| Cor tr ig ee laiz informaci éo n  correspondiente<br>Enviar cambios<br>_y<br>Enviar cambios<br>1 GG uardar Confirmacién cambios de corregidos actualizacién (UPDATE en  adolescente.aclescente- expedient se ) i<br>“ :<br>Verifia a onfirmaromfemar éxito éxito ::<br>a Wetiica y  gg arda u ard loo s  dd atos  coco rregidos __ :<br><!-- End of picture text -->

**Ingreso a gestión de expedientes** 

**Ingreso a gestión de GDOs** 



<!-- Start of picture text -->
Diagrama de Secuencia: Gestién de GDOs<br>Administrador Interfaz de gestion Controlador de GDOs ‘ado<br>Selecciona gestién de GDOs : ' '<br>| Solicitar lista de GDOs ' '<br>' | Consultar grupos registrados (adolescente.gdo)<br>' |g Registros de GDOs obtenidos !<br>|g Mostrar listado 0 buscador_|<br>'<br>Presenta el listado 0 buscador de GDOs registrados ' ' '<br>Eeaapinisador revisa la informacién de los GDOsdisponibles ' ' '<br>[Capt 7s requis rgitaran nuave SOOT<br>Selecciona la opcién correspondiente ' ' H<br>Presenta el formulario de registro de GDO i Hl Hl<br>Ingresa la informacin del GDO ; | |<br>| Enviar datos del nuevo GDO , | '<br>' | Guardar informacién (INSERT en adolescente.gdo) |<br>' |gConfirmacién de guardado f<br>‘4g Confirmar éxito ' '<br>El sistema guarda la informacién del GDO ' ' '<br>(Copt 71st requiere corregir informacion t * t<br>Selecciona la opcién correspondiente para modificar un GDO registrado , ' H '<br>| Solicitar datos vigentes : '<br>' | Consultar datos actuales de! GDO :<br>' |g Dates, recuperados !<br>‘4g Mostrar datos actuales '<br>Presenta los datos actuales del GDO ' ' '<br>Corrige la informacién correspondiente ' ' H<br>| Enviar cambios corregidos '<br>t | Guardar cambios (UPDATE en adolescente.gdo) | |<br>lg Confirmar éxito i H<br>El sistema verifica y guarda los datos corregidos ' j ;<br><!-- End of picture text -->

**Ingreso a gestión de medidas** 



<!-- Start of picture text -->
Usuario Anterfaz de gestién ‘Controladorde medidas medida_socioeducativa<br>- 1. Carga y Consulta (Pasos 1-4) }—<br>_Setegonagestn<br>‘ demeaies _Solear sta demeds scoeducatias | Consultar registros (adolescente.medida_socioeducativa)<br>Letosvartstde<br>|g Presenta el listado o buscador de medidas socioeducativas registradas obuseor '<br>eset elit o buscar demeds socorsuatvsregstas |<br>pal<br>"Seteecona wa mein pra revsar sa rmacéa<br>dettesdeiameasa<br>Soler dts dea media seesBosc<br>inomacénresvodedeiamedsa<br>sient qtissvardotsdetwmesso<br>Tages ees FAT<br>[opt7 [st se requiere registrar una nueva medida)<br>"Sekecona open conespondene<br>[gfresentaelmo rego demedida |<br>“nor infomodn dea mete sacoasuetia<br>“ardtes<br>detenuevamesisa curr frac INSERT en descent mei scoeductie<br>ormacingelameda<br>1st quale ceCentemaceato<br>"Séeecona1  a open conespnset pra med una mess reso, Solicitar datos vigentes de la medida :<br>actutesdetwmedéa<br>Soler dts vgentes iameséo Constr ats<br>Psst os ats elesdetamedsa cqtiosuardasscuales<br>“Conigetainermacénconesonsentefeardts deemed coreps _urdr cambios (UPDATE en dsescete medi sconce)<br>|gyguatasdatscoregnsElsistema veritica y guarda los datos corregidos efeotemarenty<br>gst vein |<br><!-- End of picture text -->

### **Generación de informes** 



<!-- Start of picture text -->
Diagrama de Secuencia: Generacién de informes<br>Todos los usuarios Interfaz de reportes {Controlador de informes Base de Datos<br>Acceder al médule de generactn de informes<br>Retomar tis de informe configuados<br>El stoma presenta los tipo de informes dsponbles “«Hetomar tines de informs configurades<br>_ElusuaroseecconaeltipeEl usuario selecionaeltpo dede informe forme que que requiererequire ener, generar, Envir ipo de informe seecconadoy parimetos de consult<br>Elsistema consuls informacién registra segin el tipode informe<br>“g Retomar datos consoliados (adolescents, expeleres, medidas, teres, et)<br>Generacion y Despliegve<br>Elsistema genera el informe soctado<br>Envir reprte esructurado generado pam]<br>El stema presenta elresukado del informe a usuario<br>stems presenta el esutado dt nfrme al wuorig__<br><!-- End of picture text -->

### **Obtención de UZDIs** 



<!-- Start of picture text -->
Diagrama de Secuencia: Obtencién de UZDIs<br>Administrador Interfaz del Sistema {controlador de UZDIs uz<br>Proceso<br>de Obtencign de UZDIs<br>Inca proceso que requiee informaciin de U2Dis<br>tricia proceso que requere informacion de U2DIs Solita datos de las unidades ronal :<br>H‘ Consular«Consulta UZOIsreistradasInformacinUZDIsde regstradasas unidedes (estructura, (estructurazontes recuperada istitucionaLuzdjnsttucionaizd)- 5”4<br>El | asarlosP2satlos datostos principales principales dela de las UZOIs UZDI obtenidos obtenidos<br>1 Ei sis tometema presenta a i nfofo rmac ioi n princ ipalipal dd e  aslas UZDIs U2OIs :<br>Eladministrador revsa las UZDIs disponibles :<br>pum]<br>_Eladiinistradorselecclonaadministrador seleciona una UZDIs cuando el proceso la require para vldarinfermocién<br>una U2O's cuando el proceso lo requir para valiar informacion”<br><!-- End of picture text -->

# **3. División de actividades** 

Las actividades fueron divididas en el grupo de las siguiente forma 

|**Integrantes**|**Actividad**|
|---|---|
|Francisco Miguez T.|-<br>Glosario<br>-<br>Definición<br>-<br>Diagrama de contexto<br>-<br>Diagrama de casos de uso general<br>-<br>Diagramas de casos de uso de siguiente nivel<br>-<br>Arreglos en casos de uso a detalle<br>-<br>DFD Nivel 0|
|Luis Alobuela|-<br>Apoyo en la realización de diagramas de casos de uso de<br>siguiente nivel<br>-<br>Diagramas de secuencia<br>-<br>Detalle de flujo de los casos de uso<br>-<br>Actualización de formato del detalle de casos de uso<br>-<br>Corrección del detalle de casos de uso v2<br>-<br>Corrección del detalle de casos de uso v3|
|James Arguello|-<br>Diagramas de secuencia<br>-<br>Detalle de flujo de los casos de uso|
|Carlos Sebastian|-<br>Diagramas de secuencia|
|Joan Castro|Diagrama Nivel 0|



