import { registerApplication, start } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";

console.log("[Starian] Orquestrador inicializando...");

const routes = constructRoutes(document.querySelector("#single-spa-layout") as HTMLTemplateElement);

const applications = constructApplications({
  routes,
  loadApp({ name }) {
    console.log(`[Starian] Solicitando carga do app: ${name}`);
    return (System.import(name) as any).catch((err: unknown) => {
      console.error(`[Starian] Falha crítica ao carregar ${name}:`, err);
      throw err;
    });
  },
});

const layoutEngine = constructLayoutEngine({ routes, applications });

applications.forEach(app => {
  console.log(`[Starian] Registrando app: ${app.name}`);
  registerApplication(app);
});

layoutEngine.activate();
start({
  urlRerouteOnly: true,
});
console.log("[Starian] Orquestrador ativado e pronto.");
