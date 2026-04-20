import React, { useState, useEffect } from 'react';
import { useStoreData } from '../../contexts/StoreDataContext';
import { useAdminLocale } from '../../contexts/AdminLocaleContext';
import { compressImage } from '../../utils/imageCompressor';
import { uploadToStorage } from '../../utils/firebaseStorage';
import { Loader2 } from 'lucide-react';

const CategoryManagerPage = () => {
  const { categories, addCategory, deleteCategory, updateCategory } = useStoreData();
  const { t } = useAdminLocale();
  
  // Form State
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
  const [categoryParent, setCategoryParent] = useState('');
  
  // UI State
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsUploading(true);
        const compressedBlob = await compressImage(file);
        const downloadURL = await uploadToStorage(compressedBlob, 'categories');
        setCategoryImage(downloadURL);
        setError('');
      } catch (err) {
        console.error("Error processing category image:", err);
        setError("Failed to process image. Please try another one.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryImage(category.image || '');
    setCategoryParent(category.parentCategory || '');
    setError('');
    setSuccess('');
    
    // Scroll to top to see the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryImage('');
    setCategoryParent('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!categoryName.trim()) {
      setError('Category name is required');
      return;
    }

    const categoryData = {
      name: categoryName.trim(),
      image: categoryImage,
      parentCategory: categoryParent
    };

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryData);
        setSuccess('Category updated successfully!');
      } else {
        await addCategory(categoryData);
        setSuccess('Category added successfully!');
      }

      // Reset form
      cancelEdit();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save category. Please try again.');
    }
  };

  const handleDelete = (id) => {
    setError('');
    const result = deleteCategory(id);
    if (!result.success) {
      setError(result.error);
    } else {
      setSuccess('Category deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto transition-colors duration-500 min-h-screen pb-20">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight italic uppercase">{t('categoryManagement')}</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide flex items-center">
          <span className="w-8 h-px bg-blue-600 mr-2"></span>
          Create and manage your product categories
        </p>
      </div>

      {/* Category Editor Form */}
      <div className={`bg-white dark:bg-slate-900 rounded-3xl shadow-xl border p-8 mb-12 transition-all duration-300 relative overflow-hidden ${
        editingCategory ? 'border-blue-500 shadow-blue-500/10' : 'shadow-blue-500/5 border-gray-100 dark:border-slate-800'
      }`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center uppercase italic">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-white shadow-lg ${
              editingCategory ? 'bg-indigo-600' : 'bg-blue-600'
            }`}>
              {editingCategory ? <Pencil size={18} /> : <Plus size={20} />}
            </div>
            {editingCategory ? 'Edit Category' : t('addCategory')}
          </h2>
          {editingCategory && (
            <button 
              onClick={cancelEdit}
              className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors flex items-center gap-2"
            >
              <X size={14} /> Cancel Editing
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex-1">
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1" htmlFor="categoryName">Category Name</label>
              <input
                id="categoryName"
                name="categoryName"
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g. Laptops, Smart Phones..."
                className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1" htmlFor="categoryParent">Parent Department</label>
              <select
                id="categoryParent"
                name="categoryParent"
                value={categoryParent}
                onChange={(e) => setCategoryParent(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium"
              >
                <option value="">None (Top-Level)</option>
                <option value="Computers">Computers</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1" htmlFor="categoryImageUrl">Category Image</label>
              <div className="flex gap-3">
                <div className="relative flex-grow">
                  <input
                    id="categoryImageUrl"
                    name="categoryImageUrl"
                    type="text"
                    value={categoryImage}
                    onChange={(e) => setCategoryImage(e.target.value)}
                    placeholder="URL or upload"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white text-sm"
                  />
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-600" size={18} />
                </div>
                <input
                  type="file"
                  id="category-image-upload"
                  name="category-image-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <label
                  htmlFor="category-image-upload"
                  className={`p-4 ${isUploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-2xl cursor-pointer transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center shrink-0 hover:-rotate-6`}
                >
                  {isUploading ? <Loader2 size={24} className="animate-spin" /> : <Plus size={24} />}
                </label>
              </div>
            </div>
          </div>

          {categoryImage && (
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-blue-100 dark:border-blue-900/30 group">
              <img src={categoryImage} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              <button
                type="button"
                onClick={() => setCategoryImage('')}
                className="absolute top-0 right-0 bg-red-500 text-white p-2 rounded-bl-2xl hover:bg-red-600 transition-colors shadow-lg"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className={`px-10 py-4 font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-2xl hover:-translate-y-1 active:scale-95 flex items-center ${
                editingCategory 
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 shadow-indigo-600/20' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-600/20'
              } text-white`}
            >
              {editingCategory ? (
                <>
                  <Save size={18} className="mr-2" />
                  Update Category
                </>
              ) : (
                <>
                  <Plus size={18} className="mr-2" />
                  Add Category
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 flex items-center text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl border border-red-100 dark:border-red-900/20 animate-shake">
            <AlertCircle size={18} className="mr-3 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 flex items-center text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider bg-green-50 dark:bg-green-900/10 p-4 rounded-2xl border border-green-100 dark:border-green-900/20">
            <Tag size={18} className="mr-3 shrink-0" />
            {success}
          </div>
        )}
      </div>

      {/* Category List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
        <div className="px-8 py-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50">
          <h2 className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest italic">Current Categories</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-slate-800">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} className={`px-8 py-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group ${
                editingCategory?.id === category.id ? 'bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-blue-500' : ''
              }`}>
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gray-100 dark:bg-slate-950 rounded-2xl flex items-center justify-center mr-5 text-gray-400 dark:text-slate-600 overflow-hidden border border-gray-100 dark:border-slate-800 group-hover:border-blue-200 dark:group-hover:border-blue-900/50 transition-all group-hover:scale-105 shadow-sm">
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    ) : (
                      <Tag size={24} strokeWidth={1.5} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{category.name}</h3>
                    {category.parentCategory && (
                      <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-0.5">Parent: {category.parentCategory}</p>
                    )}
                    <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">ID: {category.id}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(category)}
                    className="p-3 text-gray-300 dark:text-slate-700 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                    title="Edit Category"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-3 text-gray-300 dark:text-slate-700 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                    title="Delete Category"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="px-8 py-20 text-center">
              <div className="p-6 bg-gray-50 dark:bg-slate-950 rounded-full w-fit mx-auto mb-6">
                <Tag size={60} strokeWidth={1} className="text-gray-200 dark:text-slate-850" />
              </div>
              <p className="text-xl font-black text-gray-700 dark:text-white uppercase italic">No categories found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 font-medium">Add your first category above to organize your inventory.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManagerPage;
