const chalk = require("chalk");//SE INSTALA VERSION INFERIOR
const { Pool } = require("pg");

const config = {
  user: "postgres",
  host: "localhost",
  database: "escuela_a_m",
  password: "admin",
  port: 5432,
};
const pool = new Pool(config);

const nuevo = async (args) => {
  const rut = args[0];
  const nombre = args[1];
  const curso = args[2];
  const nivel = args[3];

  try {
    const text = "INSERT INTO estudiante (rut, nombre, curso, nivel) VALUES ($1, $2, $3, $4)";
    const values = [rut, nombre, curso, nivel];
    const result = await pool.query(text, values);
    console.log(chalk.white.bgGreen.bold(`Estudiante ${nombre} agregado con éxito`));
  } catch (e) {
    console.log(chalk.white.bgRed.bold(`Hubo un error al ingresar datos, ${e}`));
  }
};

const editar = async (args) => {
  const rut = args[0];
  const nombre = args[1];
  const curso = args[2];
  const nivel = args[3];

  try {
    const text = "UPDATE estudiante SET nombre = $1, curso = $2, nivel = $3 WHERE rut = $4";
    const values = [nombre, curso, nivel, rut];
    const result = await pool.query(text, values);
    if (result.rowCount === 0) {
      console.log(chalk.white.bgBlueBright.bold(`No hay estudiante con RUT ${rut}`));
    } else {
      console.log(chalk.white.bgGreen.bold(`Estudiante ${nombre} editado con éxito`));
    }
    
  } catch (e) {
    console.log(chalk.white.bgRed.bold(`Hubo un error al editar datos del estudiante: ${e}`));
  }
};

const rut = async (args) => {
  const rut = args[0];

  try {
    const text = "SELECT * FROM estudiante WHERE rut = $1";
    const values = [rut];
    const result = await pool.query(text, values);

    if (result.rows.length === 0) {
      console.log(chalk.white.bgBlueBright.bold(`No se encontró estudiante con rut: ${rut}.`));
    } else {
      console.log(chalk.white.bgGreen.bold(`Estudiante encontrado:`));
      console.log(result.rows);
    }
  } catch (e) {
    console.log(chalk.white.bgRed.bold(`Hubo un error al buscar al estudiante ${e}`));
  }
};

const consulta = async () => {
  try {
    const text = "SELECT rut, nombre, curso, nivel FROM estudiante";
    const result = await pool.query(text);

    if (result.rows.length === 0) {
      console.log(chalk.white.bgBlueBright.bold(`No hay estudiantes registrados`));
    } else {
      console.log(chalk.white.bgGreen.bold(`Registros:`));
      console.log(result.rows);
    }
  } catch (e) {
    console.log(chalk.white.bgRed.bold(`Hubo un error al buscar ${e}`));
  }
};

const eliminar = async (args) => {
  const rut = args[0];
  try {
    const text = "DELETE FROM estudiante WHERE rut = $1";
    const values = [rut];
    const result = await pool.query(text, values);

    if (result.rowCount === 0) {
      console.log(chalk.white.bgBlueBright.bold(`No hay estudiante con RUT ${rut}`));
    } else {
      console.log(chalk.white.bgGreen.bold(`Registro de estudiante con RUT ${rut} eliminado`));
    }
  } catch (e) {
    console.log(chalk.white.bgRed.bold(`Hubo un error al eliminar ${e}`));
  }
};

const main = async () => {
  const args = process.argv.slice(2);
  const option = args[0]; // OPCION DE LA FUNCION
  const argsFunction = args.slice(1); // ARGUMENTOS DE LA FUNCTION - SIN CONSIDERAR OPCION ESCOGIDA

  try {
    switch (option) {
      case 'nuevo':
        await nuevo(argsFunction);
        break;
      case 'editar':
        await editar(argsFunction);
        break;
      case 'rut':
        await rut(argsFunction);
        break;
      case 'consulta':
        await consulta();
        break;
      case 'eliminar':
        await eliminar(argsFunction);
        break;
      default:
        console.log(chalk.bgMagenta.bold(`Opción "${option}" no válida.`));
        console.log(chalk.bgMagenta.bold(`Opciones válidas: nuevo, editar, rut, consulta, eliminar`));
        pool.end();//FIN
    }
    pool.end();//FIN EN CADA CONSULTA
  } catch (error) {
    console.error(chalk.red.bold(`Error: ${error.message}`));
    pool.end();; // FIN
  }
};

main();
