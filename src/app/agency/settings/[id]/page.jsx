"use client";
import React, { useState } from "react";
import {
  User,
  Users,
  Building2,
  Mail,
  Phone,
  Globe,
  DollarSign,
  Upload,
  Save,
  Edit3,
  Trash2,
  Plus,
  Shield,
  Eye,
  UserCheck,
} from "lucide-react";
import Layout from "@/app/agency/components/layout/layout";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";

const ConfigurationSystem = () => {
  const [activeTab, setActiveTab] = useState("agency");
  const [agencyData, setAgencyData] = useState({
    name: "Adventure Tours Colombia",
    email: "info@adventuretours.co",
    phone: "+57 300 123 4567",
    address: "Carrera 15 #85-23, Santa Marta, Colombia",
    website: "www.adventuretours.co",
    currency: "COP",
    logo: null,
  });

  const [users, setUsers] = useState([
    {
      id: 1,
      email: "admin@adventuretours.co",
      name: "María González",
      role: "Admin",
      lastAccess: "2025-05-28",
      status: "active",
    },
    {
      id: 2,
      email: "operador@adventuretours.co",
      name: "Carlos Ruiz",
      role: "Operador",
      lastAccess: "2025-05-27",
      status: "active",
    },
    {
      id: 3,
      email: "viewer@adventuretours.co",
      name: "Ana López",
      role: "Solo lectura",
      lastAccess: "2025-05-25",
      status: "inactive",
    },
  ]);

  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    role: "Operador",
    password: "",
  });

  const [showNewUserForm, setShowNewUserForm] = useState(false);

  // Roles state
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: "Administrador",
      description: "Acceso completo al sistema",
      permissions: {
        usuarios: { create: true, read: true, update: true, delete: true },
        tours: { create: true, read: true, update: true, delete: true },
        reservas: { create: true, read: true, update: true, delete: true },
        reportes: { create: true, read: true, update: true, delete: true },
        settings: { create: true, read: true, update: true, delete: true },
      },
      usersCount: 1,
    },
    {
      id: 2,
      name: "Operador",
      description: "Gestión operativa de tours y reservas",
      permissions: {
        usuarios: { create: false, read: true, update: false, delete: false },
        tours: { create: true, read: true, update: true, delete: false },
        reservas: { create: true, read: true, update: true, delete: false },
        reportes: { create: false, read: true, update: false, delete: false },
        settings: { create: false, read: false, update: false, delete: false },
      },
      usersCount: 1,
    },
    {
      id: 3,
      name: "Solo Lectura",
      description: "Solo visualización de información",
      permissions: {
        usuarios: { create: false, read: false, update: false, delete: false },
        tours: { create: false, read: true, update: false, delete: false },
        reservas: { create: false, read: true, update: false, delete: false },
        reportes: { create: false, read: true, update: false, delete: false },
        settings: { create: false, read: false, update: false, delete: false },
      },
      usersCount: 1,
    },
  ]);

  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: {
      usuarios: { create: false, read: false, update: false, delete: false },
      tours: { create: false, read: false, update: false, delete: false },
      reservas: { create: false, read: false, update: false, delete: false },
      reportes: { create: false, read: false, update: false, delete: false },
      settings: { create: false, read: false, update: false, delete: false },
    },
  });

  const [showNewRoleForm, setShowNewRoleForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleAgencyUpdate = (field, value) => {
    setAgencyData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAgencyData((prev) => ({ ...prev, logo: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAgency = () => {
    alert("Configuración de agencia guardada exitosamente");
  };

  const handleCreateUser = () => {
    if (newUser.email && newUser.name && newUser.password) {
      const user = {
        id: users.length + 1,
        ...newUser,
        lastAccess: "Nunca",
        status: "active",
      };
      setUsers([...users, user]);
      setNewUser({ email: "", name: "", role: "Operador", password: "" });
      setShowNewUserForm(false);
      alert("Usuario creado exitosamente");
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  // Role management functions
  const handleCreateRole = () => {
    if (newRole.name && newRole.description) {
      const role = {
        id: roles.length + 1,
        ...newRole,
        usersCount: 0,
      };
      setRoles([...roles, role]);
      setNewRole({
        name: "",
        description: "",
        permissions: {
          usuarios: {
            create: false,
            read: false,
            update: false,
            delete: false,
          },
          tours: { create: false, read: false, update: false, delete: false },
          reservas: {
            create: false,
            read: false,
            update: false,
            delete: false,
          },
          reportes: {
            create: false,
            read: false,
            update: false,
            delete: false,
          },
          settings: {
            create: false,
            read: false,
            update: false,
            delete: false,
          },
        },
      });
      setShowNewRoleForm(false);
      alert("Rol creado exitosamente");
    }
  };

  const handleUpdateRole = () => {
    if (editingRole) {
      setRoles(
        roles.map((role) => (role.id === editingRole.id ? editingRole : role))
      );
      setEditingRole(null);
      alert("Rol actualizado exitosamente");
    }
  };

  const handleDeleteRole = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    if (role.usersCount > 0) {
      alert("No se puede eliminar un rol que tiene usuarios asignados");
      return;
    }
    if (window.confirm("¿Estás seguro de eliminar este rol?")) {
      setRoles(roles.filter((role) => role.id !== roleId));
    }
  };

  const handlePermissionChange = (module, action, value, isEditing = false) => {
    if (isEditing && editingRole) {
      setEditingRole({
        ...editingRole,
        permissions: {
          ...editingRole.permissions,
          [module]: {
            ...editingRole.permissions[module],
            [action]: value,
          },
        },
      });
    } else {
      setNewRole({
        ...newRole,
        permissions: {
          ...newRole.permissions,
          [module]: {
            ...newRole.permissions[module],
            [action]: value,
          },
        },
      });
    }
  };

  const getPermissionsSummary = (permissions) => {
    const modules = Object.keys(permissions);
    const totalPermissions = modules.reduce((total, module) => {
      return total + Object.values(permissions[module]).filter(Boolean).length;
    }, 0);
    const maxPermissions = modules.length * 4; // 4 actions per module
    return `${totalPermissions}/${maxPermissions}`;
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "Admin":
        return <Shield className="w-4 h-4 text-red-500" />;
      case "Operador":
        return <UserCheck className="w-4 h-4 text-blue-500" />;
      case "Solo lectura":
        return <Eye className="w-4 h-4 text-gray-500" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <Layout title="Configuración del Sistema">
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Tabs */}
        <div className="mx-auto mb-4">
          <div>
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("agency")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "agency"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Building2 className="w-5 h-5 inline mr-2" />
                Perfil de la Agencia
              </button>
              <button
                onClick={() => setActiveTab("roles")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "roles"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Shield className="w-5 h-5 inline mr-2" />
                Roles y Permisos
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "users"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Users className="w-5 h-5 inline mr-2" />
                Usuarios del Sistema
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto">
          {activeTab === "agency" && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Información de la Agencia
                </h2>
                <p className="text-sm text-gray-600">
                  Configura los datos principales de tu agencia de turismo
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Logo Section */}
                  <div className="lg:col-span-1">
                    <div className="text-center">
                      <div className="mb-4">
                        {agencyData.logo ? (
                          <img
                            src={agencyData.logo}
                            alt="Logo"
                            className="w-32 h-32 mx-auto rounded-lg object-cover border-2 border-dashed border-gray-300"
                          />
                        ) : (
                          <div className="w-32 h-32 mx-auto rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <Upload className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                        <Upload className="w-4 h-4 inline mr-2" />
                        Subir Logo
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleLogoUpload}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Form Section */}
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre de la Agencia *
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={agencyData.name}
                            onChange={(e) =>
                              handleAgencyUpdate("name", e.target.value)
                            }
                            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nombre de tu agencia"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email de Contacto *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            value={agencyData.email}
                            onChange={(e) =>
                              handleAgencyUpdate("email", e.target.value)
                            }
                            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="contacto@agencia.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Teléfono
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            value={agencyData.phone}
                            onChange={(e) =>
                              handleAgencyUpdate("phone", e.target.value)
                            }
                            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="+57 300 123 4567"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sitio Web
                        </label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="url"
                            value={agencyData.website}
                            onChange={(e) =>
                              handleAgencyUpdate("website", e.target.value)
                            }
                            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="www.tuagencia.com"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dirección
                        </label>
                        <textarea
                          value={agencyData.address}
                          onChange={(e) =>
                            handleAgencyUpdate("address", e.target.value)
                          }
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Dirección completa de la agencia"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Moneda Base *
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <select
                            value={agencyData.currency}
                            onChange={(e) =>
                              handleAgencyUpdate("currency", e.target.value)
                            }
                            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="COP">Peso Colombiano (COP)</option>
                            <option value="USD">
                              Dólar Estadounidense (USD)
                            </option>
                            <option value="EUR">Euro (EUR)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={handleSaveAgency}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Cambios
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "roles" && (
            <div className="space-y-6">
              {/* Roles List */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Gestión de Roles
                    </h2>
                    <p className="text-sm text-gray-600">
                      Configura roles y sus permisos específicos
                    </p>
                  </div>
                  <button
                    onClick={() => setShowNewRoleForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Rol
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rol
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Permisos
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usuarios
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {roles.map((role) => (
                        <tr key={role.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {role.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {role.description}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm text-gray-900">
                                {getPermissionsSummary(role.permissions)}{" "}
                                permisos
                              </div>
                              <button
                                onClick={() => setSelectedRole(role)}
                                className="ml-2 text-blue-600 hover:text-blue-900 text-xs"
                              >
                                Ver detalles
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {role.usersCount} usuario
                            {role.usersCount !== 1 ? "s" : ""}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setEditingRole({ ...role })}
                                className="text-blue-600 hover:text-blue-900 p-1"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteRole(role.id)}
                                className="text-red-600 hover:text-red-900 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* New Role Form */}
              {showNewRoleForm && (
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Crear Nuevo Rol
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre del Rol *
                        </label>
                        <input
                          type="text"
                          value={newRole.name}
                          onChange={(e) =>
                            setNewRole({ ...newRole, name: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ej: Supervisor de Tours"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Descripción *
                        </label>
                        <input
                          type="text"
                          value={newRole.description}
                          onChange={(e) =>
                            setNewRole({
                              ...newRole,
                              description: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Descripción del rol"
                        />
                      </div>
                    </div>

                    {/* Permissions Grid */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-4">
                        Permisos por Módulo
                      </h4>
                      <div className="grid grid-cols-1 gap-4">
                        {Object.entries(newRole.permissions).map(
                          ([module, perms]) => (
                            <div key={module} className="border rounded-lg p-4">
                              <h5 className="font-medium text-gray-900 mb-3 capitalize">
                                {module}
                              </h5>
                              <div className="grid grid-cols-4 gap-4">
                                {Object.entries(perms).map(
                                  ([action, value]) => (
                                    <label
                                      key={action}
                                      className="flex items-center"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={value}
                                        onChange={(e) =>
                                          handlePermissionChange(
                                            module,
                                            action,
                                            e.target.checked
                                          )
                                        }
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                      />
                                      <span className="ml-2 text-sm text-gray-700 capitalize">
                                        {action === "create"
                                          ? "Crear"
                                          : action === "read"
                                          ? "Leer"
                                          : action === "update"
                                          ? "Editar"
                                          : "Eliminar"}
                                      </span>
                                    </label>
                                  )
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowNewRoleForm(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleCreateRole}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Crear Rol
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Role Form */}
              {editingRole && (
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Editar Rol: {editingRole.name}
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre del Rol *
                        </label>
                        <input
                          type="text"
                          value={editingRole.name}
                          onChange={(e) =>
                            setEditingRole({
                              ...editingRole,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Descripción *
                        </label>
                        <input
                          type="text"
                          value={editingRole.description}
                          onChange={(e) =>
                            setEditingRole({
                              ...editingRole,
                              description: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Permissions Grid */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-4">
                        Permisos por Módulo
                      </h4>
                      <div className="grid grid-cols-1 gap-4">
                        {Object.entries(editingRole.permissions).map(
                          ([module, perms]) => (
                            <div key={module} className="border rounded-lg p-4">
                              <h5 className="font-medium text-gray-900 mb-3 capitalize">
                                {module}
                              </h5>
                              <div className="grid grid-cols-4 gap-4">
                                {Object.entries(perms).map(
                                  ([action, value]) => (
                                    <label
                                      key={action}
                                      className="flex items-center"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={value}
                                        onChange={(e) =>
                                          handlePermissionChange(
                                            module,
                                            action,
                                            e.target.checked,
                                            true
                                          )
                                        }
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                      />
                                      <span className="ml-2 text-sm text-gray-700 capitalize">
                                        {action === "create"
                                          ? "Crear"
                                          : action === "read"
                                          ? "Leer"
                                          : action === "update"
                                          ? "Editar"
                                          : "Eliminar"}
                                      </span>
                                    </label>
                                  )
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setEditingRole(null)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleUpdateRole}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Actualizar Rol
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Role Details Modal */}
              {selectedRole && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Permisos del Rol: {selectedRole.name}
                      </h3>
                      <button
                        onClick={() => setSelectedRole(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">
                          {selectedRole.description}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {selectedRole.usersCount} usuario
                          {selectedRole.usersCount !== 1 ? "s" : ""} con este
                          rol
                        </p>
                      </div>

                      <div className="space-y-4">
                        {Object.entries(selectedRole.permissions).map(
                          ([module, perms]) => (
                            <div key={module} className="border rounded-lg p-4">
                              <h4 className="font-medium text-gray-900 mb-3 capitalize">
                                {module}
                              </h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {Object.entries(perms).map(
                                  ([action, value]) => (
                                    <div
                                      key={action}
                                      className="flex items-center"
                                    >
                                      <div
                                        className={`w-3 h-3 rounded-full mr-2 ${
                                          value ? "bg-green-500" : "bg-red-500"
                                        }`}
                                      ></div>
                                      <span
                                        className={`text-sm ${
                                          value
                                            ? "text-green-700"
                                            : "text-red-700"
                                        }`}
                                      >
                                        {action === "create"
                                          ? "Crear"
                                          : action === "read"
                                          ? "Leer"
                                          : action === "update"
                                          ? "Editar"
                                          : "Eliminar"}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              {/* Users List */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Usuarios del Sistema
                    </h2>
                    <p className="text-sm text-gray-600">
                      Gestiona los usuarios y sus permisos de acceso
                    </p>
                  </div>
                  <button
                    onClick={() => setShowNewUserForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Usuario
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usuario
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rol
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Último Acceso
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getRoleIcon(user.role)}
                              <span className="ml-2 text-sm text-gray-900">
                                {user.role}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.lastAccess}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {user.status === "active" ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button className="text-blue-600 hover:text-blue-900 p-1">
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* New User Form */}
              {showNewUserForm && (
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Crear Nuevo Usuario
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre Completo *
                        </label>
                        <input
                          type="text"
                          value={newUser.name}
                          onChange={(e) =>
                            setNewUser({ ...newUser, name: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nombre del usuario"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={newUser.email}
                          onChange={(e) =>
                            setNewUser({ ...newUser, email: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="usuario@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rol *
                        </label>
                        <select
                          value={newUser.role}
                          onChange={(e) =>
                            setNewUser({ ...newUser, role: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Admin">Administrador</option>
                          <option value="Operador">Operador</option>
                          <option value="Solo lectura">Solo Lectura</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contraseña Temporal *
                        </label>
                        <input
                          type="password"
                          value={newUser.password}
                          onChange={(e) =>
                            setNewUser({ ...newUser, password: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        onClick={() => setShowNewUserForm(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleCreateUser}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Crear Usuario
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default withAuth( ConfigurationSystem,'');