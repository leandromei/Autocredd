export default function Commissions() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Comissões</h1>
      <p className="text-muted-foreground">Gerencie as comissões dos agentes</p>
      
      <div className="mt-6 space-y-4">
        <div className="p-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Ana Rodrigues</h3>
              <p className="text-sm text-muted-foreground">Cliente: Roberto Almeida</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-600">R$ 450,00</p>
              <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                Paga
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Pedro Santos</h3>
              <p className="text-sm text-muted-foreground">Cliente: Mariana Oliveira</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-blue-600">R$ 320,00</p>
              <span className="inline-block px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                Aprovada
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Julia Costa</h3>
              <p className="text-sm text-muted-foreground">Cliente: Lucas Ferreira</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-yellow-600">R$ 580,00</p>
              <span className="inline-block px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                Pendente
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}