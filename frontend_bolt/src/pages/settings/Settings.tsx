import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Save, Users, Package, Plus, Edit, Trash2 } from 'lucide-react';

export default function Settings() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: 'Configurações salvas',
      description: 'Suas alterações foram salvas com sucesso.',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Configurações"
        description="Gerencie as configurações do sistema"
      />

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="plans">Planos</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Gerencie as configurações básicas do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nome da Empresa</Label>
                  <Input id="company-name" defaultValue="AutoCred" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email de Contato</Label>
                  <Input id="contact-email" type="email" defaultValue="contato@autocred.com" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Modo Manutenção</Label>
                    <p className="text-sm text-muted-foreground">
                      Ative para exibir página de manutenção
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>
                Configure suas preferências de notificação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Novos Leads</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações de novos leads
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Contratos</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificações sobre contratos
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Comissões</Label>
                    <p className="text-sm text-muted-foreground">
                      Alertas de novas comissões
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Gerencie as configurações de segurança
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autenticação em Dois Fatores</Label>
                    <p className="text-sm text-muted-foreground">
                      Ative para maior segurança
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sessões Simultâneas</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir múltiplos logins
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Gerenciamento de Usuários
                </CardTitle>
                <CardDescription>
                  Gerencie usuários e suas permissões
                </CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Usuário
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Lista de usuários */}
                <div className="border rounded-lg">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Admin User</h4>
                        <p className="text-sm text-muted-foreground">admin@autocred.com</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Ativo</span>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">João Silva</h4>
                        <p className="text-sm text-muted-foreground">joao@autocred.com</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Ativo</span>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Maria Santos</h4>
                        <p className="text-sm text-muted-foreground">maria@autocred.com</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Inativo</span>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Gerenciamento de Planos
                </CardTitle>
                <CardDescription>
                  Configure planos e produtos disponíveis
                </CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Plano
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Lista de planos */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Plano Básico</h4>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Ideal para iniciantes
                    </p>
                    <div className="text-2xl font-bold text-green-600">R$ 29,90</div>
                    <p className="text-xs text-muted-foreground">por mês</p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Plano Premium</h4>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Para usuários avançados
                    </p>
                    <div className="text-2xl font-bold text-green-600">R$ 59,90</div>
                    <p className="text-xs text-muted-foreground">por mês</p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Plano Empresarial</h4>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Solução completa para empresas
                    </p>
                    <div className="text-2xl font-bold text-green-600">R$ 99,90</div>
                    <p className="text-xs text-muted-foreground">por mês</p>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
                    <Button variant="outline" className="h-full w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Novo Plano
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}