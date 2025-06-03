export default function Users() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Usuários</h1>
      <p className="text-muted-foreground">Gerencie os usuários do sistema</p>
      
      <div className="mt-6 space-y-4">
        <div className="p-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Admin User</h3>
              <p className="text-sm text-muted-foreground">admin@autocredgold.com</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Administrador</p>
              <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                Ativo
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Carlos Silva</h3>
              <p className="text-sm text-muted-foreground">carlos@example.com</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Gerente</p>
              <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                Ativo
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Ana Rodrigues</h3>
              <p className="text-sm text-muted-foreground">ana@example.com</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Agente</p>
              <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                Ativo
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}