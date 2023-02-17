const service_name = process.argv[2];

switch (service_name) {
  case 'foo':
  case 'bar':
  case 'baz':
    require(`./services/${service_name}/index.${service_name}`).run();
    break;
  default:
    break;
}
