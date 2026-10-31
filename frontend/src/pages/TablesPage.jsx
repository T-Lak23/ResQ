import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Edit, Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { useTableStore } from "@/store/tableStore";

export const TableCard = ({
  table,
  isEditing,
  setIsEditing,
  formData,
  setFormData,
  handleUpdateTable,
  isUpdateTableLoading,
  updateTableError,
  setUpdateTableError,
  isPublic,
  isDeleteMode,
  selectedTables,
  handleSelectTable,
}) => {
  const { tableNumber, capacity, status } = table;
  return (
    <Dialog onOpenChange={(open) => !open && setIsEditing(false)}>
      <HoverCard
        className={`rounded-2xl   text-primary-foreground font-semibold text-center flex flex-col gap-1`}
      >
        {isDeleteMode ? (
          <Button
            onClick={() => handleSelectTable(table._id)}
            className={`relative rounded-2xl p-8 font-semibold flex flex-col gap-1 ${
              selectedTables.includes(table._id)
                ? "bg-destructive hover:bg-destructive/90"
                : status === "available"
                  ? "bg-primary"
                  : "bg-primary/50"
            }`}
          >
            <span className="absolute -top-2 -right-2 rounded-md border bg-background px-2 py-1 text-xs text-foreground">
              {selectedTables.includes(table._id) ? "Selected" : "Select"}
            </span>

            <p className="text-sm">T{tableNumber}</p>
            <p className="text-xs">({capacity})</p>
          </Button>
        ) : (
          <HoverCardTrigger
            closeDelay={200}
            render={
              <DialogTrigger
                render={
                  <Button
                    className={`rounded-2xl p-8 font-semibold flex flex-col gap-1 ${
                      status === "available" ? "bg-primary" : "bg-primary/50"
                    }`}
                  >
                    <p className="text-sm">T{tableNumber}</p>
                    <p className="text-xs">({capacity})</p>
                  </Button>
                }
              />
            }
          />
        )}
        <HoverCardContent className="w-64 space-y-2 rounded-lg border bg-background p-4 text-sm shadow-md">
          <h3 className="border-b pb-2 font-semibold text-primary-foreground">
            Table {tableNumber}
          </h3>

          <p className="flex justify-between gap-4 text-primary-foreground">
            <span>Capacity:</span>
            <span className="font-medium text-primary-foreground">
              {capacity}
            </span>
          </p>

          <p className="flex justify-between gap-4 text-primary-foreground">
            <span>Status:</span>
            <span className="font-medium text-primary-foreground capitalize">
              {status}
            </span>
          </p>

          <p className="flex justify-between gap-4 text-primary-foreground">
            <span>Active:</span>
            <span className="font-medium text-primary-foreground">
              {table.isActive ? "Yes" : "No"}
            </span>
          </p>
          {!isPublic && (
            <div className="border-t pt-2 text-xs text-primary-foreground">
              <p>Created: {table.createdAt.toLocaleString()}</p>
              <p className="mt-1">
                Updated: {table.updatedAt.toLocaleString()}
              </p>
            </div>
          )}
        </HoverCardContent>
      </HoverCard>

      {!isPublic && (
        <DialogContent className="w-64 space-y-2 rounded-lg border bg-background p-4 text-sm shadow-md">
          <div className="flex flex-col items-center border-b pb-2">
            <h3 className="font-semibold text-primary-foreground">
              Table {tableNumber}
            </h3>
            {!isEditing ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setFormData({
                    tableNumber: table.tableNumber,
                    capacity: table.capacity,
                    status: table.status,
                    isActive: table.isActive,
                  });
                  setIsEditing(true);
                }}
              >
                <Edit />
              </Button>
            ) : (
              <Button
                onClick={() => {
                  handleUpdateTable(table._id);
                  setIsEditing(false);
                }}
              >
                <Save /> Save
              </Button>
            )}
          </div>

          <p className="flex items-center justify-between gap-4 text-primary-foreground">
            <span>Capacity:</span>
            {isEditing ? (
              <Input
                type="number"
                min="1"
                max="50"
                className="bg-none border-none outline-none w-15 focus:outline-none focus:ring-0
              [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
              "
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
              />
            ) : (
              <span className="font-medium text-primary-foreground">
                {capacity}
              </span>
            )}
          </p>

          <p className="flex items-center justify-between gap-4 text-primary-foreground">
            <span>Status:</span>
            {isEditing ? (
              <select
                className="bg-none border-none outline-none focus:outline-none focus:ring-0"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option
                  className="bg-background text-foreground"
                  value="available"
                >
                  Available
                </option>
                <option
                  className="bg-background text-foreground"
                  value="occupied"
                >
                  Occupied
                </option>
              </select>
            ) : (
              <span className="font-medium text-primary-foreground capitalize">
                {status}
              </span>
            )}
          </p>

          <p className="flex items-center justify-between gap-4 text-primary-foreground">
            <span>Active:</span>
            {isEditing ? (
              <Toggle
                pressed={formData.isActive}
                onPressedChange={(pressed) =>
                  setFormData({ ...formData, isActive: pressed })
                }
                className={`${formData.isActive ? "!bg-primary" : "bg-muted"} text-primary-foreground`}
              >
                {formData.isActive ? "Yes" : "No"}
              </Toggle>
            ) : (
              <span className="font-medium text-primary-foreground">
                {table.isActive ? "Yes" : "No"}
              </span>
            )}
          </p>

          {table.createdAt && (
            <div className="border-t pt-2 text-xs text-primary-foreground">
              <p>Created: {new Date(table.createdAt).toLocaleString()}</p>
              <p className="mt-1">
                Updated: {new Date(table.updatedAt).toLocaleString()}
              </p>
            </div>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
};

const AddTableModal = ({
  createMode,
  setCreateMode,
  tableMode,
  setTableMode,
  formData,
  setFormData,
  isModalOpen,
  setIsModalOpen,
  onSubmit,
  createTableError,
  setCreateTableError,
  isCreateTableLoading,
}) => {
  const items = [
    { label: "Sequential", value: "sequential" },
    { label: "Manual", value: "manual" },
  ];

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger
        render={
          <Button
            className={
              "!bg-zinc-300 !text-background hover:!bg-zinc-400 hover:scale-105 transition-transform cursor-pointer"
            }
          >
            <Plus /> Add Table
          </Button>
        }
      />

      {isModalOpen && (
        <DialogContent className="lg:min-w-150 md:min-w-125 min-w-[90%]">
          <DialogHeader>
            <DialogTitle>Add Table</DialogTitle>
            <DialogDescription>
              Add a new table to your restaurant
            </DialogDescription>
            <RadioGroup
              className="w-fit my-3"
              value={createMode}
              onValueChange={(value) => setCreateMode(value)}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="one" id="r1" />
                <Label className="cursor-pointer" htmlFor="r1">
                  Add One Table
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="many" id="r2" />
                <Label className="cursor-pointer" htmlFor="r2">
                  Add Tables
                </Label>
              </div>
            </RadioGroup>
          </DialogHeader>

          {createMode !== "one" && (
            <>
              <Select
                items={items}
                value={tableMode}
                onValueChange={(value) => setTableMode(value)}
              >
                <SelectTrigger className="w-45">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {items.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <div className="text-xs text-muted-foreground">
                <p>
                  *Sequential: Tables will be created based on initial number
                  and the total number of tables
                </p>
                <p>
                  *Manual: Tables will be created based on numbers you provide
                </p>
              </div>
            </>
          )}
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="flex flex-col gap-4">
              {createMode === "many" ? (
                tableMode === "sequential" ? (
                  <>
                    <div className="space-y-2">
                      <div>
                        <FieldLabel className={"font-semibold text-xs"}>
                          Starting Number
                        </FieldLabel>
                        <p className="text-xs text-muted-foreground">
                          Min is 1, Max is 100
                        </p>
                      </div>
                      <Input
                        type="number"
                        placeholder="Starting Number"
                        value={formData.startingNumber}
                        onChange={(e) => {
                          setCreateTableError(null);
                          setFormData((prev) => ({
                            ...prev,
                            startingNumber: e.target.value,
                          }));
                        }}
                        min={1}
                        max={100}
                        className="py-5 placeholder:text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <div>
                        <FieldLabel className={"font-semibold text-xs"}>
                          Number of Tables
                        </FieldLabel>
                        <p className="text-xs text-muted-foreground">
                          Min is 1, Max is 100
                        </p>
                      </div>
                      <Input
                        type="number"
                        placeholder="Number of Tables"
                        value={formData.numberOfTables}
                        onChange={(e) => {
                          setCreateTableError(null);
                          setFormData((prev) => ({
                            ...prev,
                            numberOfTables: e.target.value,
                          }));
                        }}
                        min={1}
                        max={100}
                        className="py-5 placeholder:text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <FieldLabel className={"font-semibold text-xs"}>
                        Table Numbers (separated by commas)
                      </FieldLabel>
                      <p className="text-xs text-muted-foreground">
                        Min is 1, Max is 100
                      </p>
                    </div>
                    <Input
                      type="text"
                      placeholder="Table Numbers"
                      value={formData.tableNumbers}
                      onChange={(e) => {
                        setCreateTableError(null);
                        setFormData((prev) => ({
                          ...prev,
                          tableNumbers: e.target.value,
                        }));
                      }}
                      className="py-5 placeholder:text-sm"
                    />
                  </div>
                )
              ) : (
                <div className="space-y-2">
                  <div>
                    <FieldLabel className={"font-semibold text-xs"}>
                      Table Number
                    </FieldLabel>
                    <p className="text-xs text-muted-foreground">Min is 1</p>
                  </div>
                  <Input
                    type="number"
                    placeholder="Table Number"
                    value={formData.tableNumber}
                    onChange={(e) => {
                      setCreateTableError(null);
                      setFormData((prev) => ({
                        ...prev,
                        tableNumber: e.target.value,
                      }));
                    }}
                    min={1}
                    className="py-5 placeholder:text-sm"
                  />
                </div>
              )}
              <div className="space-y-2">
                <div>
                  <FieldLabel className={"font-semibold text-xs"}>
                    Capacity
                  </FieldLabel>
                  <p className="text-xs text-muted-foreground">
                    Min is 1, Max is 10
                  </p>
                </div>
                <Input
                  type="number"
                  placeholder="Capacity"
                  value={formData.capacity}
                  onChange={(e) => {
                    setCreateTableError(null);
                    setFormData((prev) => ({
                      ...prev,
                      capacity: e.target.value,
                    }));
                  }}
                  min={1}
                  max={10}
                  className="py-5 placeholder:text-sm"
                />
              </div>
            </div>

            {createTableError && (
              <p className="text-red-500 my-3">{createTableError}</p>
            )}

            <Button type="submit" className={"w-full py-5 cursor-pointer"}>
              {isCreateTableLoading ? "Creating..." : "Submit"}
            </Button>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
};

const TablesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    tables,
    fetchTables,
    isTableLoading,
    isCreateTableLoading,
    createTableError,
    tableError,
    createTable,
    createTables,
    setCreateTableError,
    updateTable,
    updateTableError,
    setUpdateTableError,
    isUpdateTableLoading,
    isDeleteTableLoading,
    deleteTableError,
    deleteTables,
  } = useTableStore();

  useEffect(() => {
    fetchTables();
  }, [fetchTables, isCreateTableLoading]);

  const [formData, setFormData] = useState({
    tableNumber: "",
    capacity: "",
    status: "",
    isActive: true,
    tableNumbers: "",
    startingNumber: "",
    numberOfTables: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [createMode, setCreateMode] = useState("one");
  const [tableMode, setTableMode] = useState("sequential");
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedTables, setSelectedTables] = useState([]);

  const handleSelectTable = (tableId) => {
    setSelectedTables((prev) =>
      prev.includes(tableId)
        ? prev.filter((id) => id !== tableId)
        : [...prev, tableId],
    );
  };

  const handleCreateTables = async (e) => {
    e.preventDefault();
    try {
      const newFormData = { ...formData };
      if (tableMode === "sequential") {
        newFormData.tableNumbers = "";
      } else {
        newFormData.startingNumber = "";
        newFormData.numberOfTables = "";
      }
      newFormData.startingNumber = parseInt(newFormData.startingNumber);
      newFormData.numberOfTables = parseInt(newFormData.numberOfTables);
      newFormData.tableNumbers = newFormData.tableNumbers
        .split(",")
        .map((num) => parseInt(num));
      newFormData.capacity = parseInt(newFormData.capacity);
      newFormData.tableNumber = parseInt(newFormData.tableNumber);
      if (createMode === "one") {
        await createTable(newFormData);
        setIsModalOpen(false);
      } else {
        await createTables(newFormData);
        setIsModalOpen(false);
      }
      await fetchTables();
    } catch (error) {
      console.error("Error creating tables:", error);
    }
  };

  const handleUpdateTable = async (tableId) => {
    try {
      const newFormData = { ...formData };
      newFormData.tableNumber = parseInt(newFormData.tableNumber);
      newFormData.capacity = parseInt(newFormData.capacity);
      await updateTable(tableId, newFormData);
    } catch (error) {
      console.error("Error updating table:", error);
    }
  };

  const handleDeleteTables = async () => {
    if (selectedTables.length === 0) return;

    try {
      await deleteTables(selectedTables);

      setSelectedTables([]);
      setIsDeleteMode(false);

      await fetchTables();
    } catch (error) {
      console.error("Error deleting tables:", error);
    }
  };
  return (
    <DashboardLayout>
      <div>
        <h1 className="mb-4">Tables</h1>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <AddTableModal
            createMode={createMode}
            setCreateMode={setCreateMode}
            tableMode={tableMode}
            setTableMode={setTableMode}
            formData={formData}
            setFormData={setFormData}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            onSubmit={handleCreateTables}
            createTableError={createTableError}
            setCreateTableError={setCreateTableError}
            isCreateTableLoading={isCreateTableLoading}
          />

          {!isDeleteMode ? (
            <Button
              variant="destructive"
              onClick={() => setIsDeleteMode(true)}
              disabled={tables.length === 0}
            >
              Delete Tables
            </Button>
          ) : (
            <>
              <Button
                variant="destructive"
                onClick={handleDeleteTables}
                disabled={selectedTables.length === 0 || isDeleteTableLoading}
              >
                {isDeleteTableLoading
                  ? "Deleting..."
                  : `Delete Selected (${selectedTables.length})`}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteMode(false);
                  setSelectedTables([]);
                }}
                disabled={isDeleteTableLoading}
              >
                Cancel
              </Button>
            </>
          )}
        </div>

        {deleteTableError && (
          <p className="mb-3 text-sm text-destructive">{deleteTableError}</p>
        )}
        {isTableLoading ? (
          "Loading..."
        ) : tableError ? (
          tableError
        ) : tables.length === 0 ? (
          "No tables found"
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {tables.map((table) => (
              <TableCard
                key={table._id}
                table={table}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                formData={formData}
                setFormData={setFormData}
                handleUpdateTable={handleUpdateTable}
                isUpdateTableLoading={isUpdateTableLoading}
                updateTableError={updateTableError}
                setUpdateTableError={setUpdateTableError}
                isDeleteMode={isDeleteMode}
                selectedTables={selectedTables}
                handleSelectTable={handleSelectTable}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TablesPage;
