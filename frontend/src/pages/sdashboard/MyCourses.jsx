import React, { useEffect, useState } from 'react';
import { studentAPI } from '../../api/studentAPI';

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await studentAPI.getCourses();

      const courseData = res.data?.data || [];

      setCourses(Array.isArray(courseData) ? courseData : []);

    } catch (err) {
      console.error('Error fetching student courses:', err);

      setError(
        err.response?.data?.message ||
        'Failed to load your courses.'
      );
    } finally {
      setLoading(false);
    }
  };

  const openCourse = (courseId) => {
    window.location.href = `/student/courses/${courseId}`;
  };

  const filteredCourses = courses.filter((course) => {
    const title = course.title?.toLowerCase() || '';
    const category = course.category?.toLowerCase() || '';
    const instructor =
      course.instructor?.name?.toLowerCase() || '';

    const search = searchQuery.toLowerCase();

    return (
      title.includes(search) ||
      category.includes(search) ||
      instructor.includes(search)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

        <div>
          <h2 className="text-xl font-bold text-slate-800">
            My Courses
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            View and continue your enrolled courses
          </p>
        </div>

        <div className="w-full sm:w-80">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

      </div>

      {/* Main */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">

        {loading && (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold text-slate-500">
              Loading your courses...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold text-red-500">
              {error}
            </p>

            <button
              onClick={fetchCourses}
              className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filteredCourses.length === 0 && (
          <div className="py-16 text-center">

            <div className="text-5xl mb-4">
              📚
            </div>

            <h3 className="text-base font-bold text-slate-700">
              No courses found
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {searchQuery
                ? 'Try a different search term.'
                : 'You are not enrolled in any courses yet.'}
            </p>

          </div>
        )}

        {!loading && !error && filteredCourses.length > 0 && (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {filteredCourses.map((course) => (

              <div
                key={course._id}
                className="border border-slate-100 rounded-3xl p-5 bg-slate-50/50 hover:bg-white hover:border-indigo-100 hover:shadow-md transition"
              >

                {/* Course Header */}
                <div className="flex justify-between items-start gap-4">

                  <div>
                    <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                      {course.category}
                    </p>

                    <h3 className="mt-2 text-lg font-bold text-slate-800">
                      {course.title}
                    </h3>
                  </div>

                  <div className="text-2xl">
                    📚
                  </div>

                </div>

                {/* Description */}
                <p className="mt-3 text-sm text-slate-500 line-clamp-3">
                  {course.description}
                </p>

                {/* Instructor */}
                <div className="mt-4">

                  <p className="text-xs text-slate-400">
                    Instructor
                  </p>

                  <p className="text-sm font-semibold text-slate-700">
                    {course.instructor?.name || 'Not available'}
                  </p>

                </div>

                {/* Course Information */}
                <div className="mt-5 grid grid-cols-2 gap-3">

                  <div className="bg-white rounded-2xl p-3 border border-slate-100">
                    <p className="text-xs text-slate-400">
                      Lectures
                    </p>

                    <p className="text-sm font-bold text-slate-700 mt-1">
                      {course.lectureCount || 0}
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-3 border border-slate-100">
                    <p className="text-xs text-slate-400">
                      Category
                    </p>

                    <p className="text-sm font-bold text-slate-700 mt-1 truncate">
                      {course.category}
                    </p>
                  </div>

                </div>

                {/* Action */}
                <button
                  onClick={() => openCourse(course._id)}
                  className="mt-5 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl transition"
                >
                  View Course
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}